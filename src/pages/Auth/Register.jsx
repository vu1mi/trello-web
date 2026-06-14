import React, { useState } from "react";
import { Avatar, Box, Button, TextField, Typography, Link } from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useForm } from "react-hook-form";
import { ROLE_MESSAGES, 
        ROLE_REGEX_EMAIL, 
        ROLE_ERRORS_EMAIL, 
        ROLE_REGEX_PASSWORD, 
        ROLE_ERRORS_PASSWORD ,
        ROLE_REGEX_FULLNAME,
        ROLE_ERRORS_FULLNAME } from "../../utils/validation";
import FieldErrorAlert from "../../components/Form/FileErrorAlet";
import {registerAPI} from "~/apis/index.js";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const Register = ({ onSwitch = () => {} }) => {
    const { register,handleSubmit,watch, formState: { errors } } = useForm();
    const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

   const onSubmit = (data) => {
    const {email , password , fullname} = data;

    // registerAPI(data).then((response) => {
    //   console.log("Registration response:", response);
    // });
    toast.promise(
      registerAPI({email, password, username: fullname}),
      {
        pending: "Registering account...",
        success: "Account created successfully! Please check your email to verify your account.",
        error: "Registration failed. Please try again.",
      }
    ).then((response) => {
          navigate(`/login?registeredEmail=${email}`);
      });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} >
    <Box  sx={{ mt: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
        <Avatar sx={{ bgcolor: "primary.main" }}>
          <PersonAddIcon />
        </Avatar>
      </Box>

      <Typography variant="h5" align="center" gutterBottom>
        Create account
      </Typography>

      <TextField  fullWidth
       label="Full name"
        margin="normal"
             error={!!errors.fullname}
                  {...register("fullname", {
          required: ROLE_MESSAGES,
          pattern: {
            value: ROLE_REGEX_FULLNAME,
            message: ROLE_ERRORS_FULLNAME,
          },
        })} />
         <FieldErrorAlert errors={errors} fieldName="fullname" />
      <TextField
       fullWidth 
        label="Email"
         margin="normal"
            error={!!errors.email}
                  {...register("email", {
          required: ROLE_MESSAGES,
          pattern: {
            value: ROLE_REGEX_EMAIL,
            message: ROLE_ERRORS_EMAIL,
          },
        })}
            />
             <FieldErrorAlert errors={errors} fieldName="email" />
      <TextField 
       fullWidth
        label="Password"
         type="password"
          margin="normal"
             error={!!errors.password}
                  {...register("password", {
          required: ROLE_MESSAGES,
          pattern: {
            value: ROLE_REGEX_PASSWORD,
            message: ROLE_ERRORS_PASSWORD,
          },
        })} />
         <FieldErrorAlert errors={errors} fieldName="password" />
       
      <TextField
       fullWidth
        label="Confirm password"
         type="password"
          margin="normal"
             error={!!errors.confirm}
            {...register("confirm", {
          required: ROLE_MESSAGES,
          validate: (value) => value === watch("password") || "Passwords do not match", })
            }
            
             />
             <FieldErrorAlert errors={errors} fieldName="confirm" />

      <Button 
      type="submit" 
      fullWidth 
      variant="contained" 
      color="primary" 
      sx={{ mt: 2 }}
      className="interceptor-loading">
        Create account
      </Button>

      <Box sx={{ mt: 2, textAlign: "center" }}>
        <Typography variant="body2">
          Already have an account? <Link component="button" onClick={onSwitch}>Sign in</Link>
        </Typography>
      </Box>
    </Box>
    </form>
  );
};

export default Register;
