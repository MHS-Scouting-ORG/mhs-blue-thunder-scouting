// Shared permissions for viewing the Table and Notes sections.

const TABLE_NOTES_ALLOWED_EMAILS = [
  'toby.naumov@gmail.com',
  'shdwberu@gmail.com',
  'dn1guiwa@gmail.com',
  'jhmaui2@gmail.com',
  'miaterawaki@gmail.com',
  'jcreyn2010@gmail.com',
  'alaina.hook@gmail.com',
  'guiwadominick@gmail.com'
]

export function isTableNotesAllowed(user) {
  const email = user?.tokens?.idToken?.payload?.email?.toLowerCase?.() || ''
  return TABLE_NOTES_ALLOWED_EMAILS.includes(email)
}
export { TABLE_NOTES_ALLOWED_EMAILS }
