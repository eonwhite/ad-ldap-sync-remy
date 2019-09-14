# ChartHop / Active Directory Sync

This Node.JS script will perform a one-way sync, from current employees in ChartHop, into Active Directory,
to keep Active Directory information up-to-date with your HR contact information and roster.

This script is intended to be run within an AWS Lambda network environment that can connect to your
Active Directory instance via LDAP.

### Setup

Start by installing the Active Directory Sync app on ChartHop. This is available from the Apps and Integrations page.

Then install this script into your AWS environment. Create a Lambda function named `charthop-ad-sync`;
the exact permissions and rules may depend on your specific environment and VPC configuration, but in
general the function only needs standard Lambda access (access to write CloudWatch logs).

Set the environment variables as detailed below.

Set the Lambda timeout to at least 30 seconds.

To upload the function code, run:

```
yarn install
zip -r charthop-ad-sync.zip .
aws lambda update-function-code --function-name charthop-ad-sync --zip-file fileb://charthop-ad-sync.zip
rm charthop-ad-sync.zip
```

To create a CloudWatch rule that will run this function once per day at 1300 UTC, run (replacing `<accountid>` with your actual AWS account id):

```
aws events put-rule --name daily-charthop-ad-sync --schedule-expression "cron(0 13 * * ? *)"
aws events put-targets --rule daily-charthop-ad-sync --targets "Id"="1","Arn"="arn:aws:lambda:us-east-1:<accountid>:function:charthop-ad-sync"
```

### Environment Variables

The script expects the following environment variables to be set:

- `LDAP_URL` - the LDAP URL to connect to, for example `ldaps://my.ldap.server.example.com:636`
- `LDAP_USER` - the AD/LDAP service user account name (user@domain)
- `LDAP_PASS` - the AD/LDAP password
- `LDAP_SEARCH` - the LDAP search to conduct, for example `OU=USA,DC=com,DC=example,DC=company`
- `CHARTHOP_ORG_ID` - your ChartHop organization ID. This will be shown on the Active Directory Sync setup page in ChartHop.
- `CHARTHOP_TOKEN` - your ChartHop authorization token. This will be shown on the Active Directory Sync setup page in ChartHop.

Optionally, you can turn on test mode with the following environment variables:

- `SYNC_ALLOWLIST` - with this set to a comma-separated list of CNs, only AD/LDAP entries whose CN matches exactly the names on the allow-list will be actually all synced; the rest will be logged.
- `SYNC_TESTMATCH` - with this set to a CN, a random ChartHop person will be chosen to sync against that CN. You can use this to test the sync against a test record.

### Configuring Fields

The `fields.js` file contains a mapping of fields that will be synced, where each `FIELDS` entry contains:

- `label` (human-readable label for the field)
- `ldap` (LDAP name for the field)
- `charthop` (ChartHop's name for the field)
- `transform` (optional; a function that, given a value and the ChartHop job data, will transform the value into what it should be on the AD/LDAP side)

Feel free to modify this mapping for your organization's specific needs by modifying the file.

### Logging and Notifications

The before/after state of each record that is changed will be logged to `console.log()` and will therefore, if executed as a Lambda, wind up on CloudWatch Logs.

If any records are changed, the users on the notify list in the ChartHop settings will be emailed.
