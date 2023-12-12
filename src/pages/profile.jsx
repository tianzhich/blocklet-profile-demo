import { useState, useCallback, useEffect, useMemo } from 'react';
import { TextField, Button, Snackbar, Alert } from '@mui/material';
import Header from '@blocklet/ui-react/lib/Header';
import Footer from '@blocklet/ui-react/lib/Footer';
import './profile.css';
import { useLocaleContext } from '@arcblock/ux/lib/Locale/context';
import { usePrevious } from 'react-use';
import useProfileStorage from '../profile-storage';

const PROFILE_PROP_INFO = {
  userName: {
    rule: /^[a-zA-Z]\w{4,14}$/,
    required: true,
  },
  phone: {
    rule: /^\+?[1-9]\d{1,14}$/,
    required: false,
  },
  email: {
    rule: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
    required: true,
  },
};
const PROFILE_PROP_KEY = Object.keys(PROFILE_PROP_INFO);

function Profile() {
  const { t, locale } = useLocaleContext();
  const prevLocale = usePrevious(locale);

  const { profile, available, save: saveProfile, isNewProfile } = useProfileStorage();

  const [profileFormValues, setProfileFormValues] = useState(profile);
  const [showStorageError, setShowStorageError] = useState(!available);
  const [isEditing, setIsEditing] = useState(isNewProfile);
  const [touched, setTouched] = useState(false);

  const [errorMsg, setErrorMsg] = useState(PROFILE_PROP_KEY.map((key) => ({ [key]: '' })));
  const hasError = useMemo(() => Object.keys(errorMsg).some((key) => !!errorMsg[key]), [errorMsg]);

  const handleCloseStorageError = useCallback(() => {
    setShowStorageError(false);
  }, []);

  const handleChange = useCallback(
    (e) => {
      setProfileFormValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
      setTouched(true);
    },
    [setProfileFormValues]
  );

  const getValidateHelpText = useCallback(
    (key) => {
      if (key === 'userName') {
        return t('userNameHelpText');
      }

      return locale === 'en' ? `${t('invalid')} ${t(key)}` : `${t('invalid')}的${t(key)}格式`;
    },
    [t, locale]
  );

  const validate = useCallback(
    (name, value) => {
      if (PROFILE_PROP_KEY.indexOf(name) > -1) {
        const { rule, required } = PROFILE_PROP_INFO[name];

        if (!value || value.trim() === '') {
          if (required) {
            return t('requiredHelpText');
          }
          return '';
        }

        if (rule && !rule.test(value)) {
          return getValidateHelpText(name);
        }
        return '';
      }
      return '';
    },
    [t, getValidateHelpText]
  );

  const handleBlur = useCallback(
    (e) => {
      const { name, value } = e.target;
      const msg = validate(name, value);
      setErrorMsg({ ...errorMsg, [name]: msg });
    },
    [errorMsg, validate]
  );

  const handleValidateAll = useCallback(() => {
    const msgs = {};
    let validAll = true;

    PROFILE_PROP_KEY.forEach((key) => {
      const msg = validate(key, profileFormValues?.[key]);
      msgs[key] = msg;
      if (msg) {
        validAll = false;
      }
    });

    setErrorMsg(msgs);

    return validAll;
  }, [profileFormValues, validate]);

  const handleCancel = useCallback(() => {
    setProfileFormValues(profile);
    setIsEditing(false);
  }, [profile]);

  const handleEdit = useCallback(() => {
    setIsEditing(true);
    setTouched(false);
  }, []);

  const handleSave = useCallback(() => {
    const validAll = handleValidateAll();
    if (validAll) {
      setIsEditing(false);
      saveProfile(profileFormValues);
    }
  }, [saveProfile, handleValidateAll, profileFormValues]);

  useEffect(() => {
    // 切换语言时，如果当前处于错误状态，更新 error message
    if (hasError && prevLocale !== locale) {
      handleValidateAll();
    }
  }, [hasError, handleValidateAll, locale, prevLocale]);

  return (
    <div className="page-profile">
      <Header />
      <div className="page-profile-content">
        <h2 className="page-profile-content-header">{t('profile')}</h2>
        <div className={`page-profile-content-form${isEditing ? ' page-profile-content-form--editing' : ''}`}>
          <div className="page-profile-content-fields">
            {PROFILE_PROP_KEY.map((key) => (
              <TextField
                fullWidth
                key={key}
                label={t(key)}
                variant="standard"
                name={key}
                value={profileFormValues?.[key] ? profileFormValues[key] : ''}
                onChange={handleChange}
                InputProps={{
                  readOnly: !isEditing,
                }}
                focused={!isEditing ? false : undefined}
                className="profile-field"
                error={!!errorMsg[key]}
                helperText={errorMsg[key]}
                onBlur={handleBlur}
                required={PROFILE_PROP_INFO[key].required}
              />
            ))}
          </div>
          <div className="page-profile-content-submit">
            {isEditing ? (
              [
                <Button variant="text" color="primary" onClick={handleCancel} key="cancel">
                  {t('cancel')}
                </Button>,
                <Button
                  variant="contained"
                  color="primary"
                  disabled={!touched}
                  onClick={handleSave}
                  key="save"
                  className="profile-save-button">
                  {t(isNewProfile ? 'create' : 'save')}
                </Button>,
              ]
            ) : (
              <Button variant="contained" color="primary" onClick={handleEdit}>
                {t('edit')}
              </Button>
            )}
          </div>
        </div>
      </div>
      <Footer />
      <Snackbar
        open={showStorageError}
        onClose={handleCloseStorageError}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert onClose={handleCloseStorageError} severity="warning" sx={{ width: '80%' }}>
          {t('storageUnavailable')}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default Profile;
