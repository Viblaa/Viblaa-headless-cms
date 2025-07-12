# Viblaa Headless CMS - B2C Marketplace Backend

## Project Overview

**Strapi v5.18.0** B2C ecommerce marketplace backend with role-based user system, global product management, and commission-based earnings.

## Architecture

### User Roles & Registration

- **Custom Roles**: Vendor, Influencer, Buyer (+ default Admin/Authenticated)
- **Custom Registration**: `/api/auth/local/register` with `role_type` parameter
- **Automatic Profile Creation**: Creates vendor/influencer/buyer profiles on registration
- **Role Assignment**: Users get appropriate roles instead of default "Authenticated"

### User Management

- **Cascade Deletion**: User deletion automatically removes related profiles
- **Role-based Permissions**: Different access levels for each user type
- **JWT Authentication**: Secure token-based auth system

## Content Types

### 👤 Users

- **Vendor**: Business profiles with commission rates, verification status
- **Influencer**: Creator profiles with social networks, audience metrics  
- **Buyer**: Customer profiles with loyalty points, purchase history

### 📦 Products

- **Global Ecommerce**: Multi-currency, multi-language support
- **Slab Pricing**: Quantity-based pricing tiers with bulk discounts
- **Creator Types**: Vendors create original products, Influencers can create or link
- **Commission System**: Simple influencer commission structure (only influencers earn commission from vendor products)
- **Product Linking**: Influencers link to vendor products with custom commission rates

## Key Features

### Product Management

- **Types**: Physical, digital, service, subscription, bundle
- **Variants**: Size, color, material with individual pricing/inventory
- **Inventory**: Stock tracking, low stock alerts, backorder management
- **Media**: Images, videos, documents support
- **SEO**: Meta tags, structured data, social sharing
- **Conditional Fields**: Smart UI that shows/hides fields based on selections

### Commission & Earnings

- **Influencer Commission**: 5-50% commission rate on vendor products (configurable)
- **Commission Types**: Percentage or fixed amount per sale
- **Special Rates**: Temporary promotional commission rates with date ranges
- **Minimum Sale Amount**: Configurable threshold for commission eligibility

### Global Support

- **Compliance**: Certifications, age restrictions, country regulations
- **Shipping**: Multiple classes, zones, restricted countries
- **Localization**: Market-specific content and pricing

## API Endpoints

### Authentication

```
POST /api/auth/local/register
{
  "email": "user@example.com",
  "username": "username",
  "password": "password",
  "role_type": "vendor|influencer|buyer",
  "profile_data": { ... }
}
```

### Products

```
GET    /api/products                    # List products
POST   /api/products                    # Create product (vendor/influencer)
GET    /api/products/:id                # Get product details
PUT    /api/products/:id                # Update product
DELETE /api/products/:id                # Delete product
POST   /api/products/:id/link           # Link influencer to vendor product
GET    /api/products/vendor/:id         # Get vendor's products
GET    /api/products/influencer/:id     # Get influencer's products
GET    /api/products/:id/linked         # Get linked products
GET    /api/products/:id/price?quantity=N # Calculate slab pricing
```

### User Profiles

```
GET    /api/vendors                     # List vendors
GET    /api/influencers                 # List influencers  
GET    /api/buyers                      # List buyers
```

## Database Schema

### Product Components

- **pricing-slab**: Quantity-based pricing tiers
- **commission-settings**: Earning distribution rules
- **inventory**: Stock management
- **shipping**: Delivery configuration
- **variants**: Product variations
- **attributes**: Custom specifications
- **compliance**: Regulatory requirements
- **marketing**: Promotional settings

### Shared Components

- **address**: Physical location data
- **social-network**: Platform metrics for influencers
- **seo**: Search optimization metadata

## Development Notes

### Running Commands

```bash
npm run develop    # Start development server
npm run build      # Build admin panel
npm run start      # Production server
```

### Environment

- **Database**: PostgreSQL (docker-compose.yml)
- **Admin**: Available at /admin
- **API**: Available at /api
- **GraphQL**: Available at /graphql

### Testing

- **REST API**: All endpoints work with proper authentication
- **GraphQL**: All queries/mutations work without non-null errors
- **Cascade Deletion**: User deletion removes related profiles
- **Role Assignment**: Registration creates correct user roles

## Business Logic

### Product Creation Flow

1. **Vendor**: Creates original products with full control
2. **Influencer**: Can create own products OR link to vendor products
3. **Linked Products**: Influencer gets commission from vendor product sales
4. **Commission Split**: Automatically calculated based on settings

### Commission Distribution

- **Vendor Products Sold Directly**: Vendor keeps 100% (minus platform fees)
- **Vendor Products via Influencer**: Vendor pays influencer 5-50% commission (configurable per product)
- **Influencer Original Products**: Influencer keeps 100% (minus platform fees)
- **Simplified Model**: Only influencers earn commission when selling vendor products

### Permissions

- **Vendors**: Full CRUD on their products, read others
- **Influencers**: Full CRUD on their products, link to vendor products
- **Buyers**: Read-only access to products, price calculations
- **Admin**: Full access to all content and user management

## File Structure

```
src/
├── api/
│   ├── product/          # Product content type
│   ├── vendor/           # Vendor profiles
│   ├── influencer/       # Influencer profiles
│   └── buyer/            # Buyer profiles
├── components/
│   ├── product/          # Product-specific components
│   └── shared/           # Reusable components
├── extensions/
│   └── users-permissions/ # Custom auth logic
└── bootstrap.js          # Role setup and permissions
```

## Conditional Fields Implementation

### Product Schema Conditions

- **Physical Product Fields**: Weight, dimensions, inventory, shipping (shown only for physical products)
- **Commission Fields**: Influencer commission settings (shown only for vendor products)
- **Linking Fields**: Original product selection (shown only for influencer products)

### Component Conditions

- **Inventory**: Stock fields visible only when inventory tracking is enabled
- **Shipping**: Shipping details visible only when shipping is required
- **Commission**: Rate fields visible based on commission type (percentage vs fixed)
- **Pricing Slabs**: Date fields visible only for active slabs

### User Profile Conditions

- **Vendor**: Business license/tax ID visible for verified vendors, bank details for approved vendors
- **Influencer**: Media kit visible for verified creators, financials for approved influencers
- **Buyer**: Payment methods for active accounts, default address after first order

## Future Enhancements

- **Order Management**: Shopping cart, checkout, order tracking
- **Payment Integration**: Stripe, PayPal, crypto payments
- **Analytics Dashboard**: Sales metrics, user behavior
- **Advanced Search**: Elasticsearch integration
- **Mobile App API**: React Native/Flutter endpoints
- **Multi-vendor Marketplace**: Advanced vendor management
- **Affiliate Program**: Extended commission structures

## Important Files to Monitor

- `/src/extensions/users-permissions/strapi-server.js` - Custom auth logic
- `/src/bootstrap.js` - Role and permission setup
- `/src/api/product/controllers/product.js` - Product business logic
- `docker-compose.yml` - Database configuration
- `package.json` - Dependencies and scripts

## 📝 Updating This Documentation

**IMPORTANT**: When new features are implemented or requirements change, update this CLAUDE.md file immediately to maintain context for future sessions.

### When to Update CLAUDE.md

- **New Content Types**: Add schema details and relationships
- **New API Endpoints**: Document routes, parameters, and responses
- **Business Logic Changes**: Update commission rates, workflows, or rules
- **Permission Changes**: Document new roles or access modifications
- **Component Updates**: New shared components or modifications
- **Database Changes**: Schema updates, new relationships, migrations
- **Bug Fixes**: Document recurring issues and their solutions
- **Performance Optimizations**: Note optimization strategies and results
- **Integration Points**: New third-party services or external APIs
- **Environment Changes**: Docker, database, or deployment updates

### How to Update

1. **Add New Sections**: For major new features, create dedicated sections
2. **Update Existing Sections**: Modify relevant parts when features evolve
3. **Add Examples**: Include practical code examples for complex implementations
4. **Document Gotchas**: Note any tricky implementation details or edge cases
5. **Update Commands**: Add new development/deployment commands
6. **Version Notes**: Track major changes with dates or version numbers

### Example Update Entry

```markdown
## Recent Updates

### [YYYY-MM-DD] Feature Name
- **What**: Brief description of the change
- **Why**: Business reason or problem solved
- **Impact**: How it affects existing functionality
- **Files Changed**: List of modified files
- **API Changes**: New/modified endpoints
- **Notes**: Any important implementation details
```

### Context Preservation

This file serves as the **primary context source** for future Claude sessions. Keep it:

- **Concise**: Essential information only
- **Current**: Remove outdated information
- **Practical**: Include working examples and actual code snippets
- **Searchable**: Use clear headings and keywords
- **Complete**: Cover all major features and business logic

Remember: A well-maintained CLAUDE.md file can save hours of context rebuilding in future sessions!
