# 🚀 Consumer App API Guide - Registration & Authentication Flow

This guide provides complete documentation for integrating your consumer app with the Viblaa marketplace backend.

## 📋 Table of Contents
1. [Registration Flow](#registration-flow)
2. [Authentication Flow](#authentication-flow)
3. [Profile Management](#profile-management)
4. [Error Handling](#error-handling)
5. [Frontend Integration Examples](#frontend-integration-examples)

---

## 🔐 Registration Flow

### **Single Registration Endpoint for All User Types**

**Endpoint:** `POST /api/auth/local/register`

**Base URL:** `http://localhost:1337` (development)

---

### **1. 🏪 Vendor Registration**

```javascript
// POST /api/auth/local/register
{
  "email": "vendor@example.com",
  "username": "techstore123",
  "password": "SecurePass123!",
  "role_type": "vendor",
  "profile_data": {
    "business_name": "Tech Store Pro",
    "username": "techstore123",        // Unique vendor handle
    "phone": "+1234567890",
    "description": "Premium electronics and gadgets",
    "website": "https://techstore.com",
    "address": {
      "street_address": "123 Tech Street",
      "city": "San Francisco",
      "state": "CA",
      "postal_code": "94105",
      "country": "USA"
    }
  }
}
```

**Response:**
```javascript
{
  "user": {
    "id": 1,
    "username": "techstore123",
    "email": "vendor@example.com",
    "confirmed": false,
    "blocked": false,
    "role": {
      "id": 2,
      "name": "Vendor",
      "type": "vendor"
    }
  },
  "profile": {
    "id": 1,
    "business_name": "Tech Store Pro",
    "username": "techstore123",
    "status": "pending",           // ⚠️ Requires admin approval
    "verification_status": "unverified",
    "joined_date": "2025-07-12T10:00:00.000Z"
  },
  "role_type": "vendor",
  "message": "Registration successful! Your application is pending admin approval.",
  "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." // Only if email confirmation disabled
}
```

---

### **2. 🎬 Influencer Registration**

```javascript
// POST /api/auth/local/register
{
  "email": "influencer@example.com",
  "username": "lifestyle_guru",
  "password": "SecurePass123!",
  "role_type": "influencer",
  "profile_data": {
    "display_name": "Lifestyle Guru",
    "username": "lifestyle_guru",      // Unique influencer handle
    "phone": "+1234567890",
    "bio": "Fashion, beauty & lifestyle content creator with 500K+ followers",
    "niche_categories": ["fashion", "beauty", "lifestyle"],
    "content_type_preferences": ["posts", "stories", "videos"],
    "social_networks": [
      {
        "platform": "instagram",
        "handle": "@lifestyle_guru",
        "profile_url": "https://instagram.com/lifestyle_guru",
        "followers_count": 500000,
        "engagement_rate": 4.5,
        "verified": true,
        "is_primary": true
      },
      {
        "platform": "tiktok",
        "handle": "@lifestyle_guru",
        "profile_url": "https://tiktok.com/@lifestyle_guru",
        "followers_count": 200000,
        "engagement_rate": 8.2,
        "verified": false,
        "is_primary": false
      }
    ],
    "address": {
      "street_address": "456 Creator Ave",
      "city": "Los Angeles",
      "state": "CA",
      "postal_code": "90210",
      "country": "USA"
    }
  }
}
```

**Response:**
```javascript
{
  "user": {
    "id": 2,
    "username": "lifestyle_guru",
    "email": "influencer@example.com",
    "confirmed": false,
    "blocked": false,
    "role": {
      "id": 3,
      "name": "Influencer",
      "type": "influencer"
    }
  },
  "profile": {
    "id": 1,
    "display_name": "Lifestyle Guru",
    "username": "lifestyle_guru",
    "status": "pending",           // ⚠️ Requires admin approval
    "verification_status": "unverified",
    "social_networks": [...],
    "joined_date": "2025-07-12T10:00:00.000Z"
  },
  "role_type": "influencer",
  "message": "Registration successful! Your application is pending admin approval."
}
```

---

### **3. 🛍️ Buyer Registration**

```javascript
// POST /api/auth/local/register
{
  "email": "buyer@example.com",
  "username": "john_shopper",
  "password": "SecurePass123!",
  "role_type": "buyer",
  "profile_data": {
    "first_name": "John",
    "last_name": "Doe",
    "display_name": "John D.",
    "phone": "+1234567890",
    "date_of_birth": "1990-05-15",
    "gender": "male",
    "default_address": {
      "street_address": "789 Shopping Blvd",
      "city": "New York",
      "state": "NY",
      "postal_code": "10001",
      "country": "USA"
    },
    "newsletter_subscribed": true,
    "marketing_consent": true
  }
}
```

**Response:**
```javascript
{
  "user": {
    "id": 3,
    "username": "john_shopper",
    "email": "buyer@example.com",
    "confirmed": false,
    "blocked": false,
    "role": {
      "id": 1,
      "name": "Authenticated",
      "type": "authenticated"
    }
  },
  "profile": {
    "id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "account_status": "active",    // ✅ Active immediately
    "total_spent": 0,
    "loyalty_points": 0,
    "customer_since": "2025-07-12T10:00:00.000Z"
  },
  "role_type": "buyer",
  "message": "Registration successful! You can now start shopping.",
  "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." // Ready to use
}
```

---

## 🔑 Authentication Flow

### **Login Endpoint**

**Endpoint:** `POST /api/auth/local`

```javascript
// POST /api/auth/local
{
  "identifier": "vendor@example.com",  // Email or username
  "password": "SecurePass123!"
}
```

**Response:**
```javascript
{
  "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "techstore123",
    "email": "vendor@example.com",
    "confirmed": true,
    "blocked": false,
    "role": {
      "id": 2,
      "name": "Vendor",
      "type": "vendor"
    }
  }
}
```

### **Get User Profile After Login**

After login, fetch the user's profile based on their role:

```javascript
// For Vendors
GET /api/vendors/user/{userId}
Authorization: Bearer {jwt}

// For Influencers  
GET /api/influencers/user/{userId}
Authorization: Bearer {jwt}

// For Buyers
GET /api/buyers/me/profile
Authorization: Bearer {jwt}
```

---

## 👤 Profile Management

### **Update Profile Endpoints**

**Vendor Profile Update:**
```javascript
// PUT /api/vendors/{vendorId}
// Authorization: Bearer {jwt}
{
  "data": {
    "business_name": "Updated Tech Store",
    "description": "Updated description",
    "phone": "+1987654321"
  }
}
```

**Influencer Profile Update:**
```javascript
// PUT /api/influencers/{influencerId}
// Authorization: Bearer {jwt}
{
  "data": {
    "display_name": "Updated Name",
    "bio": "Updated bio",
    "social_networks": [...]
  }
}
```

**Buyer Profile Update:**
```javascript
// PUT /api/buyers/me/profile
// Authorization: Bearer {jwt}
{
  "data": {
    "first_name": "Updated John",
    "phone": "+1987654321",
    "preferences": {...}
  }
}
```

---

## ⚠️ Error Handling

### **Common Error Responses**

**Validation Errors:**
```javascript
{
  "error": {
    "status": 400,
    "name": "ValidationError",
    "message": "Email is already taken",
    "details": {}
  }
}
```

**Authentication Errors:**
```javascript
{
  "error": {
    "status": 401,
    "name": "UnauthorizedError", 
    "message": "Invalid credentials",
    "details": {}
  }
}
```

**Registration Errors:**
```javascript
{
  "error": {
    "status": 400,
    "name": "BadRequestError",
    "message": "Invalid role_type. Must be one of: vendor, influencer, buyer",
    "details": {}
  }
}
```

---

## 💻 Frontend Integration Examples

### **React Registration Form**

```jsx
import React, { useState } from 'react';

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    role_type: 'buyer',
    profile_data: {}
  });

  const handleRegister = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:1337/api/auth/local/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        // Store JWT if provided
        if (data.jwt) {
          localStorage.setItem('jwt', data.jwt);
        }
        
        // Handle success based on role_type
        if (data.role_type === 'buyer') {
          // Redirect to shopping
          window.location.href = '/shop';
        } else {
          // Show pending approval message
          alert(data.message);
          window.location.href = '/pending-approval';
        }
      } else {
        // Handle errors
        alert(data.error.message);
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <select 
        value={formData.role_type} 
        onChange={(e) => setFormData({...formData, role_type: e.target.value})}
      >
        <option value="buyer">Customer</option>
        <option value="vendor">Vendor/Seller</option>
        <option value="influencer">Influencer</option>
      </select>
      
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})}
        required
      />
      
      <input
        type="text"
        placeholder="Username"
        value={formData.username}
        onChange={(e) => setFormData({...formData, username: e.target.value})}
        required
      />
      
      <input
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={(e) => setFormData({...formData, password: e.target.value})}
        required
      />
      
      {/* Dynamic fields based on role_type */}
      {formData.role_type === 'vendor' && (
        <input
          type="text"
          placeholder="Business Name"
          onChange={(e) => setFormData({
            ...formData, 
            profile_data: {...formData.profile_data, business_name: e.target.value}
          })}
        />
      )}
      
      <button type="submit">Register</button>
    </form>
  );
};
```

### **Login Function**

```javascript
const login = async (identifier, password) => {
  try {
    const response = await fetch('http://localhost:1337/api/auth/local', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ identifier, password })
    });

    const data = await response.json();

    if (response.ok) {
      // Store JWT
      localStorage.setItem('jwt', data.jwt);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Fetch user profile based on role
      const profile = await fetchUserProfile(data.user);
      
      return { user: data.user, profile };
    } else {
      throw new Error(data.error.message);
    }
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

const fetchUserProfile = async (user) => {
  const jwt = localStorage.getItem('jwt');
  
  try {
    let endpoint;
    if (user.role.name === 'Vendor') {
      endpoint = `/api/vendors/user/${user.id}`;
    } else if (user.role.name === 'Influencer') {
      endpoint = `/api/influencers/user/${user.id}`;
    } else {
      endpoint = '/api/buyers/me/profile';
    }

    const response = await fetch(`http://localhost:1337${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${jwt}`,
      },
    });

    return await response.json();
  } catch (error) {
    console.error('Profile fetch error:', error);
    return null;
  }
};
```

---

## 🎯 Quick Start Checklist

1. **✅ Registration API:** `POST /api/auth/local/register`
2. **✅ Login API:** `POST /api/auth/local` 
3. **✅ Profile Fetch:** Role-specific endpoints
4. **✅ JWT Storage:** localStorage or secure cookie
5. **✅ Error Handling:** Validation & auth errors
6. **✅ Role-based UI:** Different flows for vendor/influencer/buyer

---

## 🔗 Related Endpoints

- **Vendor Discovery:** `GET /api/vendors/featured`
- **Influencer Discovery:** `GET /api/influencers/featured`
- **Search Vendors:** `GET /api/vendors?filters[business_name][$containsi]=tech`
- **Search Influencers:** `GET /api/influencers?filters[niche_categories][$contains]=fashion`

This is your complete integration guide! 🚀