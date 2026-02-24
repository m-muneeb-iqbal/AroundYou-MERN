const Layout = ({ left, middle, right }) => {
    return (
        <div className="row pt-5">
            {left && <div className="col-3">{left}</div>}
            {middle && <div className="col-6 text-center">{middle}</div>}
            {right && <div className="col-3">{right}</div>}
        </div>
  );
};

export default Layout;