# NFR Appliance Track

A comprehensive appliance tracking and management system built with Next.js, TypeScript, and Prisma.

## Features

- **Appliance Management**: Track appliances with detailed information including serial numbers, purchase/sale dates, and status
- **User Authentication**: Secure login with role-based access control
- **License Management**: Manage appliance licenses with expiration tracking
- **Order Processing**: Handle sales orders, invoices, and license distribution
- **Customer & Dealer Management**: Maintain records of customers, dealers, and sub-dealers
- **Audit Logs**: Track all changes with comprehensive logging

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, HeroUI
- **State Management**: Zustand
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Form Handling**: React Hook Form
- **Data Fetching**: SWR
- **UI Components**: Various custom components with Framer Motion animations

## Project Structure

- `/src/app` - Next.js app router pages and layouts
- `/src/components` - Reusable React components
- `/src/lib` - Utility functions and configurations
- `/prisma` - Database schema and migrations
- `/public` - Static assets

## Database Schema

The application uses a PostgreSQL database with the following main entities:
- Users & Authentication
- Appliances & Product Catalog
- Customers, Dealers, and Sub-dealers
- Licenses and Orders
- Audit Logs

<!-- ## License

[Specify your license here, e.g., MIT] -->