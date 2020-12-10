import React, { Component } from 'react';
import { withFormik, Form, Field } from 'formik'             // form management
import * as Yup from 'yup'                      // form validation

import Input from '@material-ui/core/Input'         
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import FormHelperText from '@material-ui/core/FormHelperText'
import Typography from '@material-ui/core/Typography'

// https://viblo.asia/p/quan-ly-form-trong-react-voi-formik-va-yup-p1-RQqKLvw4l7z

class SignupForm extends Component {
/*
1. Formik library has handleChange() --> you can use that by calling this.props.handleChange
and use this.props.handleChange inside <input> tag
2. Use <Form> tag to wrap all <FormControl> inside
3. use Field to avoid repetitive code:
        value={this.props.values.username}
        onChange={this.props.handleChange}
    Eg: in username section, we can write:
        <Field
            name='username'
            render={({ field }) => (
                <Input fullWidth {...field} />
            )} 
        />
    You can apply this to other fields: email, password
    Note: cannnot apply Field to select box
4. Sử dụng touched kết hợp error để thông báo lỗi cho chỉ field nào đã click, chứ ko phải tất cả cùng lúc
    this.props.touched.username
        { this.props.touched.username && this.props.error.username && <FormHelperText>{this.props.errors.username}</FormHelperText>}
    this.props.touched.email
    this.props.touched.password

*/
    render() {
        const {
            errors,         // Error bag
            touched,        // Check if the form field have ever been active
            isSubmitting    // Check if the form submiting has finish (boolean)
        } = this.props

        return (
            <Grid container justify='center' alignContent='center'>
                <Grid item xs={6} md={4}>
                    <Paper elevation={4} style={{ padding: '20px 15px', marginTop: '30px' }}>
                        <Typography variant="headline" gutterBottom>
                            Signup
                        </Typography>

                        <Form>
                            <FormControl fullWidth margin='normal' error={touched.username && !!this.props.errors.username}>
                                <InputLabel>Username</InputLabel>
                                {/* <Input 
                                    fullWidth
                                    name='username'        
                                    value={this.props.values.username}
                                    onChange={this.props.handleChange}
                                />     */}
                                <Field
                                    name='username'
                                    placeholder='example'
                                    render={({ field }) => (
                                        <Input fullWidth {...field} />
                                    )} 
                                />  
                                { touched.username && errors.username && <FormHelperText>{errors.username}</FormHelperText>}
                            </FormControl>

                            <FormControl fullWidth margin='normal' error={touched.email && !!errors.email}>
                                <InputLabel>Email</InputLabel>
                                <Field
                                    name='email'
                                    placeholder='example@gmail.com'
                                    render={({ field }) => (
                                        <Input fullWidth {...field} />
                                    )} 
                                />
                                { touched.email && errors.email && <FormHelperText>{errors.email}</FormHelperText> }
                            </FormControl>

                            <FormControl fullWidth margin='normal' error={touched.password && !!errors.password}>
                                <InputLabel>Password</InputLabel>
                                <Field
                                    name='password'
                                    render={({ field }) => (
                                        <Input fullWidth type='password' {...field} />
                                    )} 
                                />
                                { touched.password && errors.password && <FormHelperText>{errors.password}</FormHelperText> }
                            </FormControl>

                            <FormControl fullWidth margin='normal'>
                                <InputLabel>Plan</InputLabel>
                                <Select
                                    displayEmpty
                                    name='plan'
                                    value={this.props.values.plan}
                                    onChange={this.props.handleChange}
                                >
                                    <MenuItem value='basic'>Basic</MenuItem>
                                    <MenuItem value='advance'>Advance</MenuItem>
                                    <MenuItem value='enterprise'>Enterprise</MenuItem>
                                </Select>
                            </FormControl>

                            {/* <FormControlLabel
                                control={
                                    <Checkbox
                                        name='receiveLetter'
                                        checked={this.props.values.receiveLetter}
                                        onChange={this.props.handleChange} />
                                }
                                label='Receive new letter'
                            /> */}
                            <Field
                                name='receiveLetter'
                                type='checkbox'
                                checked={this.props.values.receiveLetter}
                                render={({ field }) => (
                                    <FormControlLabel
                                        control={
                                            <Checkbox {...field} />
                                        }
                                        label='Receive new letter'
                                    />
                                )}
                            />

                            <FormControl fullWidth margin='normal'>
                                <Button
                                    variant='extendedFab'
                                    color='primary'
                                    type='submit'
                                    disabled={isSubmitting}
                                    onClick={this.props.handleSubmit}
                                    
                                > Signup
                                </Button>
                            </FormControl>
                        </Form>
                    </Paper>
                </Grid>
            </Grid>
            
        )
    }
}


/* 
Nếu phần input của chúng ta có name=username
    <Input name='username' fullWidth /> 
Thì đồng nghĩa với việc trong hàm mapPropsToValues() 
ta cũng cần khai báo key của object trong hàm return là username
*/
const FormikForm = withFormik({
    // FORMIK
    mapPropsToValues() {                        // Init form field
        return {
            // username: 'hue',                 // for testing UI only
            username: '',    
            email: '',
            password: '',  
            receiveLetter: true,
            plan: 'basic'  
        }
    },

    // YUP
    // use syntax: string/required/min/max (message)
    validationSchema: Yup.object().shape({      // Validate form field 
        username: Yup.string()                              // string type
            .required('Username is required')               // username cannot be blank
            .min(5, 'Username must have min 5 characters')  // min 5 chars 
            .max(10, 'Username have max 10 characters'),    // max 10 chars
        email: Yup.string()
            .required('Email is required')
            .email('Email is invalid'),
        password: Yup.string()
            .required('Password is required')
            .min(8, 'Password must have min 8 characters'),
    }),

    // Formik has this.props.errors.[field_name] to show errors to users
    // You can use with Material-UI component (FormHelperText) to style the errora

    handleSubmit(values, { resetForm, setErrors, setSubmitting }) { // Handle submit form
        setTimeout(() => {
            if (values.email === 'example@gmail.com') {
                setErrors({ email: 'Email already taken' }) // Set error bag
            } else {
                resetForm()             // Clear form data
            }
            setSubmitting(false)        // Set isSubmitting to false
        }, 2000)
    }

})(SignupForm)

export default FormikForm