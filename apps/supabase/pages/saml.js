import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { supabase } from 'utils/supabaseClient';
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/outline';

const SAML_TENANT = process.env.NEXT_PUBLIC_TENANT;
const SAML_PRODUCT = process.env.NEXT_PUBLIC_PRODUCT;

/**
 * Edit view will have extra fields (showOnlyInEditView: true)
 * to render parsed metadata and other attributes.
 * All fields are editable unless they have `editable` set to false.
 * All fields are required unless they have `required` or `requiredInEditView` set to false.
 */
const fieldCatalog = [
  {
    key: 'name',
    label: 'Name',
    type: 'text',
    placeholder: 'MyApp',
    attributes: { required: false, requiredInEditView: false },
  },
  {
    key: 'description',
    label: 'Description',
    type: 'text',
    placeholder: 'A short description not more than 100 characters',
    attributes: { maxLength: 100, required: false, requiredInEditView: false }, // not required in create/edit view
  },
  {
    key: 'tenant',
    label: 'Tenant',
    type: 'text',
    placeholder: 'acme.com',
    attributes: { editable: false, constantVal: SAML_TENANT },
  },
  {
    key: 'product',
    label: 'Product',
    type: 'text',
    placeholder: 'demo',
    attributes: { editable: false, constantVal: SAML_PRODUCT },
  },
  {
    key: 'redirectUrl',
    label: 'Allowed redirect URLs (newline separated)',
    type: 'textarea',
    placeholder: 'http://localhost:3366',
    attributes: { isArray: true, rows: 3 },
  },
  {
    key: 'defaultRedirectUrl',
    label: 'Default redirect URL',
    type: 'url',
    placeholder: 'http://localhost:3366/login/saml',
    attributes: {},
  },
  {
    key: 'rawMetadata',
    label: 'Raw IdP XML',
    type: 'textarea',
    placeholder: 'Paste the raw XML here',
    attributes: {
      rows: 5,
      requiredInEditView: false, //not required in edit view
      labelInEditView: 'Raw IdP XML (fully replaces the current one)',
    },
  },
  {
    key: 'idpMetadata',
    label: 'IDP Metadata',
    type: 'pre',
    attributes: {
      rows: 10,
      editable: false,
      showOnlyInEditView: true,
      formatForDisplay: (value) => JSON.stringify(value, null, 2),
    },
  },
  {
    key: 'clientID',
    label: 'Client ID',
    type: 'text',
    attributes: { showOnlyInEditView: true },
  },
  {
    key: 'clientSecret',
    label: 'Client Secret',
    type: 'password',
    attributes: { showOnlyInEditView: true },
  },
];

function getFieldList(isEditView) {
  return isEditView
    ? fieldCatalog
    : fieldCatalog.filter(({ attributes: { showOnlyInEditView } }) => !showOnlyInEditView); // filtered list for add view
}

function getInitialState(samlConfig, isEditView) {
  const _state = {};
  const _fieldCatalog = getFieldList(isEditView);

  _fieldCatalog.forEach(({ key, attributes }) => {
    _state[key] = samlConfig?.[key]
      ? attributes.isArray
        ? samlConfig[key].join('\r\n') // render list of items on newline eg:- redirect URLs
        : samlConfig[key]
      : attributes.constantVal
      ? attributes.constantVal
      : '';
  });
  return _state;
}

export default function SamlConfig({ session }) {
  const router = useRouter();

  useEffect(() => {
    if (session) {
      checkForNonAdmin();
    }
  }, [session]);

  async function checkForNonAdmin() {
    const user = supabase.auth.user();
    if (user?.email !== 'admin@example.com') {
      router.push('/');
    }
  }

  const [samlConfig, setSamlConfig] = useState({});
  const [isFetching, setIsFetching] = useState(false);
  const isEditView = Object.keys(samlConfig).length > 0;

  useEffect(() => {
    fetchSAMLConfig();
  }, []);

  async function fetchSAMLConfig() {
    setIsFetching(true);
    const response = await fetch(`/api/saml/fetch?tenant=${SAML_TENANT}&product=${SAML_PRODUCT}`);
    setIsFetching(false);
    const samlConfig = await response.json();
    setSamlConfig(samlConfig);
  }

  // { status: 'UNKNOWN' | 'SUCCESS' | 'ERROR' }
  const [{ status }, setSaveStatus] = useState({
    status: 'UNKNOWN',
  });

  async function addOrUpdateSAMLConfig(event) {
    event.preventDefault();
    const { rawMetadata, redirectUrl, ...rest } = formObj;
    const encodedRawMetadata = btoa(rawMetadata || '');
    const redirectUrlList = redirectUrl.split(/\r\n|\r|\n/);

    const res = await fetch(`/api/saml/${isEditView ? 'update' : 'add'}`, {
      method: isEditView ? 'PATCH' : 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...rest, encodedRawMetadata, redirectUrl: JSON.stringify(redirectUrlList) }),
    });
    if (res.ok) {
      setSaveStatus({ status: 'SUCCESS' });
      // revalidate on save
      fetchSAMLConfig();
      setTimeout(() => setSaveStatus({ status: 'UNKNOWN' }), 2000);
      // }
    } else {
      // save failed
      setSaveStatus({ status: 'ERROR' });
      setTimeout(() => setSaveStatus({ status: 'UNKNOWN' }), 2000);
    }
  }

  // STATE: FORM
  const [formObj, setFormObj] = useState(() => getInitialState(samlConfig, isEditView));
  // Resync form state on save
  useEffect(() => {
    const _state = getInitialState(samlConfig, isEditView);
    setFormObj(_state);
  }, [samlConfig, isEditView]);

  function handleChange(event) {
    const target = event.target;
    setFormObj((cur) => ({ ...cur, [target.id]: target.value }));
  }

  return (
    <div className='m-auto max-w-[500px]'>
      <h1 className='text-lg font-bold'>SAML config</h1>
      <form onSubmit={addOrUpdateSAMLConfig}>
        <div className='min-w-[28rem] rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800 md:w-3/4 md:max-w-lg'>
          {fieldCatalog
            .filter(({ attributes: { showOnlyInEditView } }) => (isEditView ? true : !showOnlyInEditView))
            .map(
              ({
                key,
                placeholder,
                label,
                type,
                attributes: {
                  isArray,
                  rows,
                  formatForDisplay,
                  editable,
                  constantVal,
                  requiredInEditView = true, // by default all fields are required unless explicitly set to false
                  labelInEditView,
                  maxLength,
                  required = true, // by default all fields are required unless explicitly set to false
                },
              }) => {
                const readOnly = (isEditView && editable === false) || constantVal;
                const _required = isEditView ? !!requiredInEditView : !!required;
                const _label = isEditView && labelInEditView ? labelInEditView : label;
                const value =
                  readOnly && typeof formatForDisplay === 'function'
                    ? formatForDisplay(formObj[key])
                    : formObj[key];
                return (
                  <div className='mb-6 ' key={key}>
                    <label
                      htmlFor={key}
                      className='mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300'>
                      {_label}
                    </label>
                    {type === 'pre' ? (
                      <pre className='block w-full overflow-auto rounded-lg border border-gray-300 bg-gray-50 p-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500'>
                        {value}
                      </pre>
                    ) : type === 'textarea' ? (
                      <textarea
                        id={key}
                        placeholder={placeholder}
                        value={value}
                        required={_required}
                        readOnly={readOnly}
                        maxLength={maxLength}
                        onChange={handleChange}
                        className={`block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 ${
                          isArray ? 'whitespace-pre' : ''
                        }`}
                        rows={rows}
                      />
                    ) : (
                      <input
                        id={key}
                        type={type}
                        placeholder={placeholder}
                        value={value}
                        required={_required}
                        readOnly={readOnly}
                        maxLength={maxLength}
                        onChange={handleChange}
                        className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500'
                      />
                    )}
                  </div>
                );
              }
            )}
          <div className='flex'>
            <button type='submit' className='btn-primary'>
              Save Changes
            </button>
            <p
              role='status'
              className={`ml-2 inline-flex items-center ${
                status === 'SUCCESS' || status === 'ERROR' ? 'opacity-100' : 'opacity-0'
              } transition-opacity motion-reduce:transition-none`}>
              {status === 'SUCCESS' && (
                <span className='text-primary inline-flex items-center'>
                  <CheckCircleIcon aria-hidden className='mr-1 h-5 w-5'></CheckCircleIcon>
                  Saved
                </span>
              )}
              {/* TODO: also display error message once we standardise the response format */}
              {status === 'ERROR' && (
                <span className='inline-flex items-center text-red-900'>
                  <ExclamationCircleIcon aria-hidden className='mr-1 h-5 w-5'></ExclamationCircleIcon>
                  ERROR
                </span>
              )}
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
