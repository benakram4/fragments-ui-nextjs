function LoginButton( props ) {
  return (
    <button
      type="button"
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold 
                  py-2 px-4 my-3 rounded"
      onClick= { props.handleLoginClick }
    >
      Log in
    </button>
  );
}

export default LoginButton;