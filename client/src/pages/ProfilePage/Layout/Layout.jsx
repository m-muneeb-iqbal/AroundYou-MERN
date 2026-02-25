const Layout = ({ left, middle }) => {
    return (
        <div className="row pt-5">
            {left && <div className="col-3">{left}</div>}
            {middle && <div className="col-6 text-center">{middle}</div>}
        </div>
  );
};

export default Layout;