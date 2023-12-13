import { flatten } from 'flat';

export default flatten({
  userName: 'UserName',
  email: 'Email',
  phone: 'Phone',
  create: 'Create',
  edit: 'Edit',
  save: 'Save',
  cancel: 'Cancel',
  storageUnavailable:
    "You current browser doesn't support localStorage. Your profile info will not be stored. Please try to use a modern browser with latest version, like Chrome, Firefox, Safari, etc...",
  storageQuotaExceeded: 'Your current browser localStorage is full. Your profile info will not be stored.',
  profile: 'Personal Information',
  userNameHelpText:
    'The username should start with a letter, be 5 to 15 characters long, and only contain letters, numbers, and underscores.',
  invalid: 'Invalid',
  requiredHelpText: 'This item is required.',
});
