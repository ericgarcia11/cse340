import db from './db.js'

const updateOrganization = async (organizationId, name, description, contactEmail, logoFilename) => {
  const query = `
    UPDATE organization
    SET name = $1, description = $2, contact_email = $3, logo_filename = $4
    WHERE organization_id = $5
    RETURNING organization_id;
  `;

  const queryParams = [name, description, contactEmail, logoFilename, organizationId];
  const result = await db.query(query, queryParams);

  if (result.rows.length === 0) {
    throw new Error('Organization not found');
  }

  if (process.env.ENABLE_SQL_LOGGING === 'true') {
    console.log('Updated organization with ID:', organizationId);
  }

  return result.rows[0].organization_id;
};

export {updateOrganization};