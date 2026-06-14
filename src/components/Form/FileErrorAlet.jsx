import Alert from "@mui/material/Alert";

function FieldErrorAlert({ errors, fieldName }) {
  // Nếu không có lỗi hoặc field này không có lỗi → không render gì
  if (!errors || !errors[fieldName]) return null;

  return (
    <Alert
      severity="error"
      sx={{
        mt: "0.7em",
        width: "100%",
        boxSizing: "border-box",
        ".MuiAlert-message": { overflow: "hidden" }
      }}
    >
      {errors[fieldName]?.message}
    </Alert>
  );
}

export default FieldErrorAlert;