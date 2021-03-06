import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import validateForm from 'helpers/validateForm';
// import Cookies from 'js-cookie';
import checkAuth from 'helpers/checkAuth';
import { userServices } from 'services';
import toaster from 'toasted-notes';
import 'toasted-notes/src/styles.css';

const ChangePassword = props => {
  const [state, setState] = useState({});
  const [err, setErr] = useState({});
  const [rep, setRep] = useState({
    incorrect: '',
  });

  if (!checkAuth()) return <Redirect to="/" />;

  const handleChange = event => {
    setRep({ incorrect: '' });
    const newState = {
      ...state,
      [event.target.name]: event.target.value,
    };
    setState(newState);
    setErr(validateForm(newState));
  };

  const handleSubmit = event => {
    event.preventDefault();

    if (!err.old_password && !err.password && !err.confirm_password) {
      userServices
        .changePassword({
          old_password: state.old_password,
          new_password: state.password,
          confirm_password: state.confirm_password,
        })
        .then(res => {
          toaster.notify(res.data.successful, {
            duration: 5000,
          });
          // eslint-disable-next-line
          props.history.push('/logged');
        })
        .catch(res => {
          setRep({ incorrect: res.response.data.message.split(':')[1] });
        });
    }
  };

  // Using (?? :D ??) bulma framework
  return (
    <div>
      <h5 className="page-head-title">Change Password</h5>
      <div className="section is-fullheight">
        <div className="container">
          <div className="column is-4 is-offset-4">
            <p>{rep.incorrect}</p>
            <div className="box">
              <form onSubmit={handleSubmit}>
                <div className="field">
                  {/* eslint-disable-next-line */}
                  <label className="label">
                    Current password
                    <div className="control">
                      <input
                        className="input"
                        type="password"
                        name="old_password"
                        placeholder="Current password"
                        // eslint-disable-next-line
                        autoFocus
                        value={state.old_password}
                        onChange={e => handleChange(e)}
                      />
                      {err.old_password && <p className="help is-danger">{err.old_password}</p>}
                    </div>
                  </label>
                </div>

                <div className="field">
                  {/* eslint-disable-next-line */}
                  <label className="label">
                    Enter new password
                    <div className="control">
                      <input
                        className="input"
                        type="password"
                        name="password"
                        placeholder="New password"
                        value={state.password}
                        onChange={e => handleChange(e)}
                      />
                      {err.password && <p className="help is-danger">{err.password}</p>}
                    </div>
                  </label>
                </div>

                <div className="field">
                  {/* eslint-disable-next-line */}
                  <label className="label">
                    Re-enter password
                    <div className="control">
                      <input
                        className="input"
                        type="password"
                        placeholder="Confirm password"
                        name="confirm_password"
                        // required
                        value={state.confirm_password}
                        onChange={e => handleChange(e)}
                      />
                      {err.confirm_password && <p className="help is-danger">{err.confirm_password}</p>}
                    </div>
                  </label>
                </div>

                <button type="submit" className="button is-block is-info is-fullwidth">
                  Change password
                </button>
              </form>
              {/* <div>
                <Link to="/login">Login</Link>
                <br />
                <Link to="/register">Do not have an account? Register!</Link>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ChangePassword;
