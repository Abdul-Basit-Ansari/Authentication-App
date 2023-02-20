import * as Yup from "yup";

export const signUpSchema = Yup.object({
  fullName: Yup.string().min(3).max(50).required("Please Enter Your Full Name"),
  userName: Yup.string().min(5).max(50).required("Please Enter Your User Name"),
  email: Yup.string().email().required("Please Enter Your Email"),
  password: Yup
    .string()
    .required('Please Enter Your Password')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
    ),
  cpassword: Yup.string()
  .required("Please Enter Password Again For Confirmation")
    .oneOf([Yup.ref("password"), null], "Password must match"),
});
