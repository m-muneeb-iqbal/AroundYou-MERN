import { useScrollToSectionCover } from "../../../hooks/useScrollToSectionCover";
import { useState, useEffect } from "react";
import { useAuthStore } from "../../../store/useAuthStore";
import bootstrap from "bootstrap/dist/js/bootstrap.bundle";
import { useLocation, useNavigate } from "react-router-dom";

const Section1 = () => {
  const scrollToSectionCover = useScrollToSectionCover();
  const navigate = useNavigate();
  const location = useLocation();
  const { signup, isSigningUp } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: "",
    role: "",
    password: "",
    confirmPassword: "",
  });
  useEffect(() => {

    const modalEl = document.getElementById("signUpModal");
    if (!modalEl) return;

    const modalInstance = new bootstrap.Modal(modalEl);

    if (location.pathname === "/signup"){
      modalInstance.show();
    }

    const handleHidden = () => {
      document.body.classList.remove("modal-open");
      const backdrop = document.querySelector(".modal-backdrop");
      if (backdrop) backdrop.remove();
      navigate("/"); // 👈 back to home
    };

    modalEl.addEventListener("hidden.bs.modal", handleHidden);

    return () => {
      modalEl.removeEventListener("hidden.bs.modal", handleHidden);
    };
  }, [location, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    if (!form.checkValidity()) {
      e.stopPropagation();
      form.classList.add("was-validated");
      return;
    }

    try {
      await signup(formData);
      console.log("Signup successful ✅");

      // Reset form
      setFormData({
        fullName: "",
        email: "",
        username: "",
        role: "",
        password: "",
        confirmPassword: "",
      });
      form.classList.remove("was-validated");

      // Close signup modal and clean up
      const modalEl = document.getElementById("signUpModal");
      const modalInstance = bootstrap.Modal.getInstance(modalEl);
      modalInstance.hide();
      
      modalEl.addEventListener("hidden.bs.modal", () => {
        navigate("/login");
      });

    } catch (err) {
      console.error("Signup failed ❌", err);
      alert(err.response?.data?.message || "Signup failed");
    }
  };
  return (
    <section className="container-fluid mt-0 section-1">
      <div className="row">
        <div className="col-lg-7 col-12 d-flex flex-column align-items-center text-center mt-3 pt-3">
          <p className="text-white fw-bold private-social-text mt-5 pt-5">
            The private social app made for
            <span className="college-life-text d-inline-block">
              college life
            </span>
            .
          </p>

          <img
            src="/Images/notIcons/line_home.png"
            alt="main heading underline"
            className="img-fluid line"
          />

          <div className="mt-5 pt-5 pb-1 mt-md-3 pt-md-3 pb-md-0 ">
            <button
              type="button"
              className="btn btn-success join-btn"
              onClick = {() => navigate("/signup")}
            >
              Sign up Now
              <img
                src="/Images/icons/arrow-icon.png"
                alt=""
                className="img-fluid"
              />
            </button>

            <div
              className="modal fade"
              id="signUpModal"
              data-bs-backdrop="static"
              data-bs-keyboard="false"
              tabindex="-1"
              aria-labelledby="signUpModalLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content">
                  <svg
                    type="button"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    viewBox="0 0 16 16"
                    width="2em"
                    height="2em"
                    focusable="false"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    className="mx-5 mt-3 bi-arrow-left-circle b-icon bi"
                  >
                    <g>
                      <path
                        fill-rule="evenodd"
                        d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z"
                      ></path>
                    </g>
                  </svg>

                  <div className="modal-body p-5">
                    <p
                      className="modal-title fw-bolder text-start waiting-list"
                      id="signUpModalLabel"
                    >
                      Join the Waiting List and Secure Your Spot!
                    </p>

                    <p className="text-start">
                      Exciting things are coming, and you don't want to miss
                      out!
                    </p>
                    <form
                      onSubmit={handleSubmit}
                      className="needs-validation"
                      noValidate
                    >
                      <input
                        type="text"
                        placeholder="Full Name"
                        className="form-control col-md-12 mb-3"
                        value={formData.fullName}
                        onChange={(e) =>
                          setFormData({ ...formData, fullName: e.target.value })
                        }
                        required
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        className="form-control col-md-12 mb-3"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        required
                      />
                      <input
                        type="text"
                        placeholder="Username"
                        className="form-control col-md-12 mb-3"
                        value={formData.username}
                        onChange={(e) =>
                          setFormData({ ...formData, username: e.target.value })
                        }
                        required
                      />
                      <select
                        className="form-control col-md-12 mb-3"
                        value={formData.role}
                        onChange={(e) =>
                          setFormData({ ...formData, role: e.target.value })
                        }
                        required
                      >
                        <option value="" disabled>
                          -- Select your role --
                        </option>
                        <option value="Student">Student</option>
                        <option value="Alumni">Alumni</option>
                      </select>
                      <input
                        type="password"
                        placeholder="Enter Password"
                        className="form-control col-md-12 mb-3"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        required
                        minLength={8}
                      />
                      <input
                        type="password"
                        placeholder="Confirm Password"
                        className="form-control col-md-12 mb-3"
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            confirmPassword: e.target.value,
                          })
                        }
                        required
                        minLength={8}
                      />
                      <button
                        className="btn btn-success col-md-12 w-100 main-submit"
                        disabled={isSigningUp}
                        type="submit"
                      >
                        {isSigningUp ? "Joining..." : "Join"}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <img
            src="/Images/icons/Mouse.png"
            alt="scroll mouse"
            className="img-fluid mouse-icon"
            onClick={() => scrollToSectionCover(".cover-section")}
          />
        </div>

        <div className="col-lg-5 flex-column d-flex align-items-center justify-content-center">
          <div className="d-lg-block d-none px-5">
            <div className="d-flex justify-content-center align-items-center rounded-circle outer-1">
              <div className="main-image position-absolute">
                <img
                  src="/Images/notIcons/Mobile logo Style.png"
                  alt="aroundyou logo"
                  className="img-fluid"
                />
              </div>

              <div className="image-1 position-absolute">
                <img
                  src="/Images/notIcons/image 22.png"
                  alt="icon 1"
                  className="img-fluid"
                />
              </div>

              <div className="check-image-1 position-absolute">
                <img
                  src="/Images/notIcons/check-image-1.png"
                  alt="check icon 1"
                  className="img-fluid"
                />
              </div>

              <div className="image-2 position-absolute">
                <img
                  src="/Images/notIcons/Group 494.png"
                  alt="icon 2"
                  className="img-fluid"
                />
              </div>

              <div className="image-3 position-absolute">
                <img
                  src="/Images/notIcons/image 23.png"
                  alt="icon 3"
                  className="img-fluid"
                />
              </div>

              <div className="check-image-3 position-absolute">
                <img
                  src="/Images/notIcons/check-image-3.png"
                  alt="check icon 3"
                  className="img-fluid"
                />
              </div>

              <div className="image-4 position-absolute">
                <img
                  src="/Images/notIcons/Rectangle 163.png"
                  alt="icon 4"
                  className="img-fluid"
                />
              </div>

              <div className="check-image-4 position-absolute">
                <img
                  src="/Images/notIcons/check-image-4.png"
                  alt="check icon 4"
                  className="img-fluid"
                />
              </div>

              <div className="image-5 position-absolute">
                <img
                  src="/Images/notIcons/Group 497.png"
                  alt="icon 5"
                  className="img-fluid"
                />
              </div>

              <div className="image-6 position-absolute">
                <img
                  src="/Images/notIcons/Rectangle 168.png"
                  alt="icon 6"
                  className="img-fluid"
                />
              </div>

              <div className="check-image-6 position-absolute">
                <img
                  src="/Images/notIcons/check-image-6.png"
                  alt="check icon 6"
                  className="img-fluid"
                />
              </div>

              <div className="image-7 position-absolute">
                <img
                  src="/Images/notIcons/image 21.png"
                  alt="icon 7"
                  className="img-fluid"
                />
              </div>

              <div className="check-image-7 position-absolute">
                <img
                  src="/Images/notIcons/check-image-7.png"
                  alt="check icon 7"
                  className="img-fluid"
                />
              </div>

              <div className="image-8 position-absolute">
                <img
                  src="/Images/notIcons/Group 493.png"
                  alt="icon 8"
                  className="img-fluid"
                />
              </div>

              <div className="image-9 position-absolute">
                <img
                  src="/Images/notIcons/Avatar 16 1.png"
                  alt="icon 9"
                  className="img-fluid"
                />
              </div>

              <div className="check-image-9 position-absolute">
                <img
                  src="/Images/notIcons/check-image-9.png"
                  alt="check icon 9"
                  className="img-fluid"
                />
              </div>

              <div className="image-10 position-absolute">
                <img
                  src="/Images/notIcons/Rectangle 169.png"
                  alt="icon 10"
                  className="img-fluid"
                />
              </div>

              <div className="check-image-10 position-absolute">
                <img
                  src="/Images/notIcons/check-image-10.png"
                  alt="check icon 10"
                  className="img-fluid"
                />
              </div>

              <div className="image-11 position-absolute">
                <img
                  src="/Images/notIcons/Group 495.png"
                  alt="icon 11"
                  className="img-fluid"
                />
              </div>

              <div className="image-12 position-absolute">
                <img
                  src="/Images/notIcons/Rectangle 167.png"
                  alt="icon 12"
                  className="img-fluid"
                />
              </div>

              <div className="check-image-12 position-absolute">
                <img
                  src="/Images/notIcons/check-image-12.png"
                  alt="check icon 12"
                  className="img-fluid"
                />
              </div>

              <div className="image-13 position-absolute">
                <img
                  src="/Images/notIcons/Rectangle 165.png"
                  alt="icon 13"
                  className="img-fluid"
                />
              </div>

              <div className="check-image-13 position-absolute">
                <img
                  src="/Images/notIcons/check-image-13.png"
                  alt="check icon 13"
                  className="img-fluid"
                />
              </div>

              <div className="line-1 position-absolute"></div>
              <div className="line-2 position-absolute"></div>
              <div className="line-3 position-absolute"></div>
              <div className="line-4 position-absolute"></div>
              <div className="line-5 position-absolute"></div>
              <div className="line-6 position-absolute"></div>
              <div className="line-7 position-absolute"></div>
              <div className="line-8 position-absolute"></div>
              <div className="line-9 position-absolute"></div>
              <div className="line-10 position-absolute"></div>
              <div className="line-11 position-absolute"></div>
              <div className="line-12 position-absolute"></div>
              <div className="line-13 position-absolute"></div>

              <div className="d-flex justify-content-center align-items-center rounded-circle outer-2">
                <div className="d-flex justify-content-center align-items-center rounded-circle outer-3">
                  <div className="d-flex justify-content-center align-items-center rounded-circle outer-4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Section1;
