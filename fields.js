/**
 * This file contains the custom mapping rules between ChartHop and Active Directory / LDAP.
 *
 * You can configure this file and write your own transformers as appropriate for your organization.
 *
 * For a full list of AD/LDAP mappings, see http://www.kouti.com/tables/userattributes.htm
 *
 * Each FIELDS entry contains:
 *   label: Human-readable label for the field
 *   ldap: The field name on the AD/LDAP side
 *   charthop: The field name on the ChartHop side
 *   (Optional) charthopExtraFields: Additional field(s) to retrieve from ChartHop to support the transformation
 *   (Optional) transform: A function that, given the field value, and the ChartHop data object, returns the field
 *     value as it should be stored on the AD/LDAP side.
 */

function transformPhone(phone) {
  if (phone.length === 12) {
    return (
      phone.substring(0, 2) +
      "-" +
      phone.substring(2, 5) +
      "-" +
      phone.substring(5, 8) +
      "-" +
      phone.substring(8)
    );
  } else {
    return phone;
  }
}
module.exports.transformPhone = transformPhone;

module.exports.FIELDS = [
  { label: "Name", ldap: "displayName", charthop: "name" },
  {
    label: "First Name",
    ldap: "givenName",
    charthop: "name.first",
    charthopExtraFields: "name.pref",
    transform: function(value, job) {
      if (job["name.pref"]) {
        return job["name.pref"];
      } else {
        return value;
      }
    }
  },
  {
    label: "Last Name",
    ldap: "sn",
    charthop: "name.last",
    transform: function(value) {
      if (value === "Frangopoulos") {
        return "FERRARI";
      }
      return value.toUpperCase();
    }
  },
  {
    label: "Department",
    ldap: "department",
    charthop: "department.name",
    charthopExtraFields: "team.name",
    transform: function(value, charthopJob) {
      // if a member of two or more teams, use the department name
      if (
        !charthopJob["team.name"] ||
        charthopJob["team.name"].indexOf(",") > -1
      ) {
        return charthopJob["department.name"];
      } else {
        return charthopJob["team.name"];
      }
    }
  },
  {
    label: "Office Name",
    ldap: "physicalDeliveryOfficeName",
    charthop: "location.name"
  },
  {
    label: "Street",
    ldap: "streetAddress",
    charthop: "location.address.street1"
  },
  { label: "City", ldap: "l", charthop: "location.address.city" },
  { label: "State", ldap: "st", charthop: "location.address.state" },
  { label: "Country", ldap: "co", charthop: "location.address.country" },
  {
    label: "Postal Code",
    ldap: "postalCode",
    charthop: "location.address.postal"
  },
  { label: "Title", ldap: "title", charthop: "title" },
  {
    label: "Work Phone",
    ldap: "telephoneNumber",
    charthop: "contact.workPhone",
    transform: transformPhone
  },
  { label: "Work Email", ldap: "mail", charthop: "contact.workEmail" },
  { label: "Manager", ldap: "manager", charthop: "manager" }
];
