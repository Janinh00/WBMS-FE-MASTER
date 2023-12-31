import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Button, FormControl, InputLabel, Select, TextField, MenuItem, CircularProgress } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../../../components/layout/signed/Header";
import Swal from "sweetalert2";
import { useConfig, useUser } from "../../../../hooks";

const UserView = () => {
  // const initialValues = {
  //   username: "",
  //   email: "",
  //   nik: "",
  //   name: "",
  //   division: "",
  //   position: "",
  //   phone: "",
  //   role: 0,

  //   isLDAPUser: false,
  // };
  const userSchema = yup.object().shape({
    username: yup.string().required(),
    email: yup.string().email().required(),
    nik: yup.string().required(),
    name: yup.string().required(),
    division: yup.string().required(),
    position: yup.string().required(),
    role: yup.number().required(),
  });
  const { id } = useParams();

  const navigate = useNavigate();

  const { ROLES } = useConfig();
  const { useSearchFirstUserMutation, useUpdateUserMutation, useDeleteUserMutation } = useUser();
  const [deleteUser] = useDeleteUserMutation();
  const [searchUserFirst, { isLoadingSearchUser }] = useSearchFirstUserMutation();
  const [UpdateUser, { isLoading }] = useUpdateUserMutation();

  const isNonMobile = useMediaQuery("(min-width:600px)");

  const [userValues, setUserValues] = useState([]);
  const [dtRoles, setDtRoles] = useState(ROLES);

  const handleFormikSubmit = (values) => {
    try {
      UpdateUser(values).then((results) => {
        navigate("/wb/administration/users");
      });
      console.log("values", values);
    } catch (error) {
      toast.error(`${error.message}.`);
      return;
    }
  };

  const handleClose = () => {
    navigate("/wb/administration/users");
  };

  const handleDelete = (id, name) => {
    Swal.fire({
      title: `Yakin Ingin Menghapus?`,
      html: `<span style="font-weight: bold; font-size: 28px;">"${name}"</span>`,
      icon: "question",
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonColor: "#D80B0B",
      cancelButtonColor: "grey",
      cancelButtonText: "Cancel",
      confirmButtonText: "Hapus",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteUser(id)
          .then((res) => {
            console.log("Data berhasil dihapus:", res.data);
            toast.success("Data berhasil dihapus"); // Show success toast
            navigate("/wb/administration/users");
            // Handle any additional actions or update the state as needed
          })
          .catch((error) => {
            console.error("Data Gagal dihapus:", error);
            toast.error("Data Gagal dihapus"); // Show error toast
            // Handle the error or display an error message
          });
      }
    });
  };

  useEffect(() => {
    console.log("Fetch user by id:", id);

    const data = {
      where: {
        id,
      },
    };

    searchUserFirst(data).then((results) => {
      const userData = { ...results.data.data.user };
      setUserValues(userData); // Memperbarui userValues dengan nilai yang ditemukan
      console.log("results search user:", userData);
    });
  }, []);

  return (
    <>
      <Box mt={4}>
        <Header title="USER DATA" subtitle="Informasi Detail User" />

        <Formik onSubmit={handleFormikSubmit} initialValues={userValues} >
          {({ values, errors, touched, handleBlur, handleChange, handleSubmit }) => {
            return (
              <form onSubmit={handleSubmit}>
                <Box display="flex" justifyContent="end">
                  {/* <Box flex={1}></Box> */}

                  {/* <Button type="submit" variant="contained" sx={{ mb: 1 }}>
                    Simpan
                  </Button> */}
                  {isLoading && (
                    <CircularProgress
                      size={24}
                      sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        marginTop: "-12px",
                        marginLeft: "-12px",
                      }}
                    />
                  )}
                  {/* <Button
                    variant="contained"
                    sx={{ mb: 1, ml: 0.5 }}
                    onClick={() => {
                      console.log("values", userValues);
                    }}
                  >
                    Di Non-Aktifkan
                  </Button> */}
                  {/* <Button variant="contained" sx={{ mb: 1, ml: 0.5 }} onClick={handleDelete}>
                    Hapus
                  </Button> */}
                  <Button variant="contained" sx={{ mb: 1, ml: 0.5 }} onClick={handleClose}>
                    Kembali
                  </Button>
                </Box>
                <Box
                  display="grid"
                  gap="30px"
                  gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                  sx={{ "& > div": { gridColumn: isNonMobile ? undefined : "span 4" } }}
                >
                  <TextField
                    name="name"
                    label="Nama"
                    InputLabelProps={{shrink: true,}}
                    type="text"
                    required
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={userValues.name}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={!!touched.name && !!errors.name}
                    helperText={touched.name && errors.name}
                    sx={{ gridColumn: "span 2" }}
                    disabled
                  />
                  <TextField
                    name="nik"
                    label="NIK"
                    InputLabelProps={{shrink: true,}}
                    type="text"
                    required
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={userValues.nik}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={!!touched.nik && !!errors.nik}
                    helperText={touched.nik && errors.nik}
                    sx={{ gridColumn: "span 2" }}
                    disabled
                  />
                  <TextField
                    name="username"
                    label="Username"
                    InputLabelProps={{shrink: true,}}
                    type="text"
                    required
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={userValues.username}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={!!touched.username && !!errors.username}
                    helperText={touched.username && errors.username}
                    sx={{ gridColumn: "span 2" }}
                    disabled
                  />
                  <TextField
                    name="email"
                    label="Email"
                    InputLabelProps={{shrink: true,}}
                    type="text"
                    required
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={userValues.email}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={!!touched.email && !!errors.email}
                    helperText={touched.email && errors.email}
                    sx={{ gridColumn: "span 2" }}
                    disabled
                  />
                  <TextField
                    name="position"
                    label="Posisi"
                    InputLabelProps={{shrink: true,}}
                    type="text"
                    required
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={userValues.position}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={!!touched.position && !!errors.position}
                    helperText={touched.position && errors.position}
                    sx={{ gridColumn: "span 2" }}
                    disabled
                  />
                  <TextField
                    name="division"
                    label="Divisi"
                    InputLabelProps={{shrink: true,}}
                    type="text"
                    required
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={userValues.division}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={!!touched.division && !!errors.division}
                    helperText={touched.division && errors.division}
                    sx={{ gridColumn: "span 2" }}
                    disabled
                  />
                  <TextField
                    name="phone"
                    label="Telephone"
                    InputLabelProps={{shrink: true,}}
                    type="text"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={userValues.phone}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={!!touched.phone && !!errors.phone}
                    helperText={touched.phone && errors.phone}
                    sx={{ gridColumn: "span 2" }}
                    disabled
                  />

                  <FormControl fullWidth size="small" sx={{ gridColumn: "span 2" }} required>
                    <InputLabel id="role">Role</InputLabel>
                    <Select
                      labelId="role"
                      label="Role"
                      name="role"
                      value={userValues.role}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      error={!!touched.role && !!errors.role}
                      helperText={touched.role && errors.role}
                      disabled
                    >
                      {dtRoles &&
                        dtRoles.length > 0 &&
                        dtRoles?.map((data, index) => {
                          return (
                            <MenuItem key={index} value={data.id}>
                              {data.value}
                            </MenuItem>
                          );
                        })}
                    </Select>
                  </FormControl>

                  {/* <div sx={{ gridColumn: "span 2" }}></div> */}
                </Box>
              </form>
            );
          }}
        </Formik>
      </Box>
    </>
  );
};

export default UserView;
