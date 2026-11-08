# Railway Deployment Checklist - CORS Fix

## ✅ Code Changes (Already Done)
- [x] Custom CORS middleware added
- [x] Trust proxy enabled
- [x] PORT environment variable handling
- [x] Listening on 0.0.0.0
- [x] Railway environment detection
- [x] Code pushed to GitHub

## 🚀 Railway Configuration Steps

### Step 1: Wait for Deployment
Railway should automatically deploy your latest commit. Check:
1. Go to Railway dashboard
2. Find your radiology-service project
3. Check the "Deployments" tab
4. Wait for the build to complete (usually 2-5 minutes)

### Step 2: Verify Environment Variables
Make sure these are set in Railway:

**Required Variables:**
```
DB_URL=postgresql://...
AWS_REGION=your-region
AWS_USER_POOL_ID=your-pool-id
AWS_CLIENT_ID=your-client-id
NODE_ENV=production
```

**To check/add variables:**
1. Go to your service in Railway
2. Click "Variables" tab
3. Add any missing variables
4. Click "Deploy" if you made changes

### Step 3: Check Deployment Logs
1. In Railway dashboard, click on your service
2. Go to "Deployments" tab
3. Click on the latest deployment
4. Check logs for:
   ```
   🚀 Radiology Service is running!
   ☁️  Environment: Railway
   📍 Service URL: https://your-app.up.railway.app
   🌐 CORS: Enabled for all origins
   ```

### Step 4: Get Your Railway URL
1. In Railway dashboard, find your service
2. Look for "Settings" tab
3. Under "Domains", you'll see your public domain
4. Copy this URL (e.g., `radiology-service.up.railway.app`)

### Step 5: Test CORS from Mobile

**Test 1: Browser Test**
Open mobile browser and go to:
```
https://YOUR-RAILWAY-URL.up.railway.app/docs
```
You should see Swagger documentation.

**Test 2: API Test**
Try a simple API call from your mobile app:
```javascript
fetch('https://YOUR-RAILWAY-URL.up.railway.app/api/endpoint', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  }
})
```

**Test 3: Check Network Tab**
In mobile browser, open DevTools (if available) and check:
- Response headers should include `Access-Control-Allow-Origin`
- No CORS errors in console

## 🔍 Troubleshooting

### Issue: Deployment Failed
**Check:**
- Build logs in Railway for errors
- Make sure all dependencies are in package.json
- Verify Node.js version compatibility

**Solution:**
```bash
# Check Railway logs
railway logs

# Or in Railway dashboard: Deployments > Latest > View Logs
```

### Issue: App Crashes After Deployment
**Check:**
- Environment variables are set correctly
- Database is accessible from Railway
- No missing dependencies

**Solution:**
1. Check Railway logs for error messages
2. Verify DB_URL is correct
3. Make sure all AWS credentials are set

### Issue: CORS Still Not Working
**Check:**
1. Deployment completed successfully
2. Using HTTPS (not HTTP) in your requests
3. Using correct Railway URL

**Debug:**
Look for CORS logs in Railway:
```
[CORS] OPTIONS /api/endpoint from origin: https://your-frontend.com
[CORS] Preflight request handled for /api/endpoint
```

### Issue: Works on WiFi but Not Mobile Data
**This is expected behavior for local development!**

**Solution:**
- Use your Railway URL instead of local IP
- Railway URL works from anywhere (WiFi, mobile data, any network)

## 📱 Update Your Frontend/Mobile App

After Railway deployment, update your API base URL:

**Before (Local Development):**
```javascript
const API_URL = 'http://192.168.0.100:3000';
```

**After (Production):**
```javascript
const API_URL = 'https://your-app.up.railway.app';
```

**Best Practice (Environment-based):**
```javascript
const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-app.up.railway.app'
  : 'http://localhost:3000';
```

## 🎯 Expected Results

After successful deployment:

✅ **From WiFi:**
- Local development: Works with `http://192.168.x.x:3000`
- Railway: Works with `https://your-app.up.railway.app`

✅ **From Mobile Data:**
- Local development: ❌ Won't work (network limitation)
- Railway: ✅ Works perfectly with `https://your-app.up.railway.app`

✅ **From Any Network:**
- Railway URL works from anywhere in the world
- No CORS errors
- No network restrictions

## 🔐 Security Notes

The current CORS configuration allows **all origins** (`origin: true`).

**For Production, consider restricting origins:**

```typescript
// In main.ts, update CORS middleware
app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  // Whitelist specific origins
  const allowedOrigins = [
    'https://your-frontend.com',
    'https://your-mobile-app.com',
    'http://localhost:3000', // For local development
  ];
  
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  
  // ... rest of CORS headers
});
```

## 📞 Next Steps

1. ✅ Wait for Railway deployment to complete
2. ✅ Get your Railway public URL
3. ✅ Test from mobile browser: `https://YOUR-URL/docs`
4. ✅ Update your frontend/mobile app with Railway URL
5. ✅ Test from mobile data
6. ✅ Celebrate! 🎉

## 💡 Pro Tips

1. **Use Environment Variables** in your frontend for API URLs
2. **Monitor Railway Logs** for any issues
3. **Set up Custom Domain** (optional) for better branding
4. **Enable Railway Metrics** to monitor performance
5. **Set up Health Checks** to ensure uptime

## 🆘 Still Having Issues?

If CORS still doesn't work after deployment:

1. Share the Railway deployment logs
2. Share the exact error message from mobile
3. Share the Railway public URL
4. Verify the deployment shows the new code (check logs for "CORS: Enabled for all origins")
