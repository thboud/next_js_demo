import { Input, Grid, TextField, Box, Card, CardActions, CardContent, CardHeader, Typography, Button, Container, FormControl, InputLabel, InputAdornment } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Register_Form from "./authentication_forms/register";
import Login_Form from "./authentication_forms/login";

const Authentication = props => (
  <div>
    <Grid container direction="row" justify="center" alignItems="center" spacing={2}>
      {/*LOGIN FORM*/}
      <Grid item={true} xs={6}>
        <Login_Form />
      </Grid>
      {/*Register FORM*/}
      <Grid item={true} xs={6}>
        <Register_Form />
      </Grid>
    </Grid>
  </div>
);

export default Authentication;
