import "./errorPrompt.scss"
function ErrorPrompt() {
    return ( 
        <div className="errorParent">
            <div className="subHeading">Errors</div>
            Please make sure all supplied values are between 1 and 100.
        </div>
     );
}

export default ErrorPrompt;