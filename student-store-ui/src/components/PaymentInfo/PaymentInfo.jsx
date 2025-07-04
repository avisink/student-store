import "./PaymentInfo.css"

export default function PaymentInfo({ userInfo, setUserInfo, handleOnCheckout, isCheckingOut, error }) {
  return (
    <div className="PaymentInfo">
      <h3 className="">
        Payment Info{" "}
        <span className="button">
          <i className="material-icons md-48">monetization_on</i>
        </span>
      </h3>
      <div className="input-field">
        <label className="label">Student ID</label>
        <div className="control ">
          <input
            className="input"
            type="text"
            placeholder="Student Id" 
            // {bruh, this thing is referenced as userinfo.name everywhere, hello?? Need to keep this in mind though}
            value={userInfo.customer_id ?? ""} //change back to name bruh
            onChange={(e) => setUserInfo((u) => ({ ...u, customer_id: e.target.value }))}
          />
        </div>
      </div>

      <div className="input-field">
        <label className="label">Email</label>
        <div className="control">
          <input
            className="input"
            type="email"
            placeholder="Email"
            value={userInfo.id ?? ""}
            onChange={(e) => setUserInfo((u) => ({ ...u, id: e.target.value }))}
          />
        </div>
      </div>

      {/* {<div className="field">
        <div className="control">
          <label className="checkbox">
            <input
              type="checkbox"
              checked={userInfo.termsAndConditions}
              onChange={(e) => setUserInfo((u) => ({ ...u, termsAndConditions: !u.termsAndConditions }))}
            />
            <span className="label">
              I agree to the <a href="#terms-and-conditions">terms and conditions</a>
            </span>
          </label>
        </div>
      </div>} */}

      <p className="is-danger">{error}</p>

      <div className="field">
        <div className="control">
          <button className="button" disabled={isCheckingOut} onClick={handleOnCheckout}>
            Submit
          </button>
        </div>
      </div>
    </div>
  )
}
