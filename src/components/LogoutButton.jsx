function LogoutButton(props) {
  return (
    <button
      type="button"
      className="bg-red-500 hover:bg-red-700 text-white font-bold 
            py-2 px-4 my-3 rounded"
      onClick={props.handleLogoutClick}
    >
      Sign out
    </button>
  );
}

export default LogoutButton;
