'use strict';

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::vendor.vendor', ({ strapi }) => ({
  
  // Custom service to update vendor status
  async updateStatus(vendorId, status) {
    try {
      const entity = await strapi.entityService.update('api::vendor.vendor', vendorId, {
        data: { status },
        populate: {
          logo: true,
          banner_image: true,
          address: true,
          user: {
            fields: ['id', 'username', 'email']
          }
        },
      });

      // Log status change
      strapi.log.info(`Vendor ${vendorId} status changed to ${status}`);
      
      return entity;
    } catch (error) {
      strapi.log.error('Error updating vendor status:', error);
      throw error;
    }
  },

  // Custom service to update verification status
  async updateVerificationStatus(vendorId, verificationStatus) {
    try {
      const entity = await strapi.entityService.update('api::vendor.vendor', vendorId, {
        data: { verification_status: verificationStatus },
        populate: {
          logo: true,
          banner_image: true,
          address: true,
          user: {
            fields: ['id', 'username', 'email']
          }
        },
      });

      strapi.log.info(`Vendor ${vendorId} verification status changed to ${verificationStatus}`);
      
      return entity;
    } catch (error) {
      strapi.log.error('Error updating vendor verification status:', error);
      throw error;
    }
  },

  // Custom service to calculate and update vendor rating
  async updateRating(vendorId) {
    try {
      const vendor = await strapi.entityService.findOne('api::vendor.vendor', vendorId, {
        populate: {
          // This would populate reviews when you create a reviews content type
          // reviews: true,
        },
      });

      // Placeholder logic - replace with actual review calculation
      // const reviews = vendor.reviews || [];
      // const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      // const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

      // For now, keep existing rating
      const averageRating = vendor.rating || 0;

      const updatedVendor = await strapi.entityService.update('api::vendor.vendor', vendorId, {
        data: { rating: averageRating },
      });

      return updatedVendor;
    } catch (error) {
      strapi.log.error('Error updating vendor rating:', error);
      throw error;
    }
  },

  // Custom service to get vendor statistics
  async getVendorStats(vendorId) {
    try {
      const vendor = await strapi.entityService.findOne('api::vendor.vendor', vendorId, {
        populate: {
          // products: true, // Uncomment when products relation exists
          // orders: true,   // Uncomment when orders relation exists
        },
      });

      if (!vendor) {
        throw new Error('Vendor not found');
      }

      return {
        vendorId: vendor.id,
        businessName: vendor.business_name,
        username: vendor.username,
        totalProducts: 0, // vendor.products?.length || 0,
        totalSales: vendor.total_sales || 0,
        rating: vendor.rating || 0,
        status: vendor.status,
        verificationStatus: vendor.verification_status,
        joinedDate: vendor.joined_date,
        isFeatured: vendor.is_featured,
        commissionRate: vendor.commission_rate,
      };
    } catch (error) {
      strapi.log.error('Error getting vendor stats:', error);
      throw error;
    }
  },

  // Custom service to approve vendor
  async approveVendor(vendorId) {
    try {
      const vendor = await this.updateStatus(vendorId, 'approved');
      await this.updateVerificationStatus(vendorId, 'verified');

      // Send approval notification email
      await this.sendApprovalEmail(vendor);

      strapi.log.info(`Vendor ${vendorId} approved successfully`);
      return vendor;
    } catch (error) {
      strapi.log.error('Error approving vendor:', error);
      throw error;
    }
  },

  // Custom service to reject vendor
  async rejectVendor(vendorId, reason = '') {
    try {
      const vendor = await this.updateStatus(vendorId, 'rejected');
      await this.updateVerificationStatus(vendorId, 'rejected');

      // Send rejection notification email
      await this.sendRejectionEmail(vendor, reason);

      strapi.log.info(`Vendor ${vendorId} rejected. Reason: ${reason}`);
      return vendor;
    } catch (error) {
      strapi.log.error('Error rejecting vendor:', error);
      throw error;
    }
  },

  // Custom service to suspend vendor
  async suspendVendor(vendorId, reason = '') {
    try {
      const vendor = await this.updateStatus(vendorId, 'suspended');

      // Send suspension notification email
      await this.sendSuspensionEmail(vendor, reason);

      strapi.log.info(`Vendor ${vendorId} suspended. Reason: ${reason}`);
      return vendor;
    } catch (error) {
      strapi.log.error('Error suspending vendor:', error);
      throw error;
    }
  },

  // Custom service to verify vendor
  async verifyVendor(vendorId) {
    try {
      const vendor = await this.updateVerificationStatus(vendorId, 'verified');
      strapi.log.info(`Vendor ${vendorId} verified successfully`);
      return vendor;
    } catch (error) {
      strapi.log.error('Error verifying vendor:', error);
      throw error;
    }
  },

  // Custom service to get vendors by status
  async findByStatus(status, options = {}) {
    try {
      return await strapi.entityService.findMany('api::vendor.vendor', {
        filters: { status },
        populate: {
          logo: true,
          banner_image: true,
          address: true,
          user: {
            fields: ['id', 'username', 'email']
          }
        },
        ...options,
      });
    } catch (error) {
      strapi.log.error('Error finding vendors by status:', error);
      throw error;
    }
  },

  // Custom service to search vendors
  async searchVendors(searchTerm, options = {}) {
    try {
      return await strapi.entityService.findMany('api::vendor.vendor', {
        filters: {
          $or: [
            { business_name: { $containsi: searchTerm } },
            { username: { $containsi: searchTerm } },
            { description: { $containsi: searchTerm } },
          ],
        },
        populate: {
          logo: true,
          banner_image: true,
          address: true,
          user: {
            fields: ['id', 'username', 'email']
          }
        },
        ...options,
      });
    } catch (error) {
      strapi.log.error('Error searching vendors:', error);
      throw error;
    }
  },

  // Custom service to find vendor by username
  async findByUsername(username) {
    try {
      const vendors = await strapi.entityService.findMany('api::vendor.vendor', {
        filters: { username },
        populate: {
          logo: true,
          banner_image: true,
          address: true,
          user: {
            fields: ['id', 'username', 'email']
          }
        },
      });

      return vendors.length > 0 ? vendors[0] : null;
    } catch (error) {
      strapi.log.error('Error finding vendor by username:', error);
      throw error;
    }
  },

  // Email notification services (placeholder implementations)
  async sendApprovalEmail(vendor) {
    try {
      // Implement with your email service (SendGrid, Mailgun, etc.)
      strapi.log.info(`Sending approval email to ${vendor.contact_email}`);
      
      // Example implementation:
      // await strapi.plugins['email'].services.email.send({
      //   to: vendor.contact_email,
      //   subject: 'Vendor Application Approved',
      //   html: `<p>Congratulations! Your vendor application for ${vendor.business_name} has been approved.</p>`
      // });
      
      return true;
    } catch (error) {
      strapi.log.error('Error sending approval email:', error);
      return false;
    }
  },

  async sendRejectionEmail(vendor, reason) {
    try {
      strapi.log.info(`Sending rejection email to ${vendor.contact_email}`);
      
      // Example implementation:
      // await strapi.plugins['email'].services.email.send({
      //   to: vendor.contact_email,
      //   subject: 'Vendor Application Rejected',
      //   html: `<p>Your vendor application for ${vendor.business_name} has been rejected.</p><p>Reason: ${reason}</p>`
      // });
      
      return true;
    } catch (error) {
      strapi.log.error('Error sending rejection email:', error);
      return false;
    }
  },

  async sendSuspensionEmail(vendor, reason) {
    try {
      strapi.log.info(`Sending suspension email to ${vendor.contact_email}`);
      
      // Example implementation:
      // await strapi.plugins['email'].services.email.send({
      //   to: vendor.contact_email,
      //   subject: 'Vendor Account Suspended',
      //   html: `<p>Your vendor account for ${vendor.business_name} has been suspended.</p><p>Reason: ${reason}</p>`
      // });
      
      return true;
    } catch (error) {
      strapi.log.error('Error sending suspension email:', error);
      return false;
    }
  },

  // Custom service to increment total sales
  async incrementSales(vendorId, amount) {
    try {
      const vendor = await strapi.entityService.findOne('api::vendor.vendor', vendorId);
      const newTotal = (vendor.total_sales || 0) + amount;

      return await strapi.entityService.update('api::vendor.vendor', vendorId, {
        data: { total_sales: newTotal },
      });
    } catch (error) {
      strapi.log.error('Error incrementing vendor sales:', error);
      throw error;
    }
  },

}));