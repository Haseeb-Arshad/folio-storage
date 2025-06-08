# Cloudflare R2 Migration Guide

This document outlines the migration from Pinata IPFS to Cloudflare R2 for file storage in the portfolio application.

## Overview

- **Previous Storage**: Pinata IPFS
- **New Storage**: Cloudflare R2
- **Migration Date**: June 2024
- **Primary Benefits**:
  - Lower costs
  - Faster uploads/downloads
  - Better integration with Cloudflare's CDN
  - No egress fees

## Configuration

### Environment Variables

Update your `.env` file with the following R2-specific variables:

```env
# Cloudflare R2 Configuration
CLOUDFLARE_R2_ACCOUNT_ID=your_account_id
CLOUDFLARE_R2_ACCESS_KEY_ID=your_access_key
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your_secret_key
CLOUDFLARE_R2_BUCKET_NAME=your_bucket_name
CLOUDFLARE_R2_PUBLIC_URL=https://your-account-id.r2.cloudflarestorage.com/your-bucket-name
```

### Required IAM Permissions

Ensure your Cloudflare API token has these permissions:
- Account Settings: Read
- Account Resources: All accounts
- R2: All operations

## API Endpoints

All existing file-related endpoints remain the same. The changes are internal to the storage service.

### Key Changes

1. **File URLs**:
   - Old: `https://gateway.pinata.cloud/ipfs/{cid}`
   - New: `https://pub-{account-id}.r2.dev/{key}` (public) or presigned URL (private)

2. **File Metadata**:
   - `ipfs_hash` field now stores the R2 object key
   - `ipfs_pin_status` is maintained for backward compatibility but always returns "pinned" for R2

## Testing

Run the test script to verify the integration:

```bash
# Install test dependencies
npm install uuid @types/uuid

# Run tests
npx ts-node test-r2-integration.ts
```

## Rollback Plan

In case of issues, you can rollback by:

1. Reverting to the previous commit before R2 migration
2. Updating environment variables to use Pinata
3. Restarting the application

## Troubleshooting

### Common Issues

1. **Authentication Errors**:
   - Verify your R2 credentials
   - Check token permissions
   - Ensure the bucket exists

2. **CORS Issues**:
   - Verify CORS configuration in R2 bucket settings
   - Ensure allowed origins include your application's domain

3. **Upload Failures**:
   - Check file size limits
   - Verify network connectivity to Cloudflare
   - Check Cloudflare status page for outages

## Monitoring

Monitor these metrics in Cloudflare Dashboard:
- Storage used
- Number of objects
- Request rates
- Data transfer

## Support

For issues, contact:
- Cloudflare Support: https://support.cloudflare.com
- Development Team: [Your Contact Info]
