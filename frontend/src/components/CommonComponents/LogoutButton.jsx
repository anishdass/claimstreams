const LogoutButton = ({logout}) => {
  return (
    <button
      type='button'
      onClick={logout}
      className='px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-semibold hover:bg-rose-500/20 hover:border-rose-500/40 transition-all active:scale-95 cursor-pointer'>
      Logout
    </button>
  );
};

export default LogoutButton;
