import '../views/TenantForm.css';

export default function Tenant() {
  return (
    <div>
      <p className='prompt'>Enter tenant to login</p>
      <form method='get' action='/' className='form'>
        <label htmlFor='tenant'>Tenant</label>
        <input
          type='text'
          pattern='^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$'
          title='Enter a valid tenant'
          name='tenant'
          placeholder='acme.com'
          id='tenant'></input>
        <button type='submit' color='primary' className='btn btn-secondary btn-margin'>
          Proceed
        </button>
      </form>
    </div>
  );
}
