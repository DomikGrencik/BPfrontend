import React, { useEffect, useState, useCallback } from "react";
import { CircularProgress } from "@mui/material";
import { List } from "@mui/material";
import { ListItem } from "@mui/material";
import { IconButton } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import { TextField } from "@mui/material";
import { Modal } from "@mui/material";
import { Button } from "@mui/material";
import { Box } from "@mui/system";
import { Fab } from "@mui/material";
import { FormControl } from "@mui/material";
import { Select } from "@mui/material";
import { InputLabel } from "@mui/material";
import { MenuItem } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import EditIcon from "@mui/icons-material/Edit";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { apiFetch } from "../utils/apiFetch";
import { useAppContext } from "../../App";
import { useNavigate } from "react-router-dom";
import _ from "lodash";
import Chart from "react-apexcharts";

const Patient = () => {
  const {
    initialize,
    getItem,
    setItem,
    testId,
    setTestId,
    setIsVisibleProfileButton,
    setCancelNewTestButton,
    isShortTest,
    setIsShortTest,
  } = useAppContext();
  const userToken = getItem("userToken");
  const userId = getItem("userId");

  const setIsVisibleMenuButton = useCallback(
    (isVisibleMenuButton) =>
      setItem("isVisibleMenuButton", isVisibleMenuButton),
    [setItem]
  );

  const [patient, setPatient] = useState({});
  const [newPatient, setNewPatient] = useState({});
  const [tests, setTests] = useState([]);
  const [shortTests, setShortTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteTF, setIsDeleteTF] = useState(false);
  const [isOptionsTF, setIsOptionsTF] = useState(true);

  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const [openModalTest, setOpenModalTest] = useState(false);
  const handleOpenModalTest = () => setOpenModalTest(true);
  const handleCloseModalTest = () => setOpenModalTest(false);

  const [openModalEdit, setOpenModalEdit] = useState(false);
  const handleOpenModalEdit = () => setOpenModalEdit(true);
  const handleCloseModalEdit = () => setOpenModalEdit(false);

  const navigate = useNavigate();

  const getTestDX = useCallback(
    async (id_test) => {
      const response = await apiFetch({
        route: `/test_tasks/getTestPoints/${id_test}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      if (response) {
        let dx = 0;
        response.forEach((element) => (dx += parseFloat(element.points)));
        return dx;
      } else {
        initialize();
        navigate("/", { replace: true });
      }
    },
    [initialize, navigate, userToken]
  );

  const getShortTestDX = useCallback(
    async (id_test) => {
      const response = await apiFetch({
        route: `/short_test_tasks/getShortTestPoints/${id_test}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      if (response) {
        let dx = 0;
        response.forEach((element) => (dx += parseFloat(element.points)));
        return dx;
      } else {
        initialize();
        navigate("/", { replace: true });
      }
    },
    [initialize, navigate, userToken]
  );

  // Gets patient's general data
  useEffect(() => {
    const fetchData = async () => {
      const response = await apiFetch({
        route: `/patients/${userId}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      if (response) {
        setPatient(response);
        setNewPatient(response);
      } else {
        initialize();
        navigate("/", { replace: true });
      }
    };
    if (userToken) {
      fetchData();
    } else {
      navigate("/", { replace: true });
    }
  }, [initialize, navigate, userId, userToken]);

  // Gets all existing tests of patient
  useEffect(() => {
    const fetchData = async () => {
      const response = await apiFetch({
        route: `/tests/${userId}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
        setLoading,
      });

      if (response) {
        setLoading(true);
        const tests = await Promise.all(
          response.reverse().map(async (test) => {
            test.dx = await getTestDX(test.id_test);
            return test;
          })
        );
        setTests(tests);
        setLoading(false);
      } else {
        initialize();
        navigate("/", { replace: true });
      }
    };
    if (userToken) {
      fetchData();
    } else {
      navigate("/", { replace: true });
    }
  }, [getTestDX, initialize, navigate, userId, userToken]);

  // Deletes one test of patient
  const deleteTest = useCallback(async () => {
    const response = await apiFetch({
      route: `/tests/${testId}`,
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });

    if (response) {
      setTests(tests.filter((test) => test.id_test !== testId));
    } else {
      initialize();
      navigate("/", { replace: true });
    }
  }, [initialize, navigate, testId, tests, userToken]);

  // Adds new test to patint
  const addTest = useCallback(async () => {
    const response = await apiFetch({
      route: "/tests",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
      body: { id_patient: `${userId}` },
    });

    if (response) {
      setTestId(response.id_test);
      navigate("/test", { replace: true });
    } else {
      initialize();
      navigate("/", { replace: true });
    }
  }, [initialize, navigate, setTestId, userId, userToken]);

  // Gets all existing short tests of patient
  useEffect(() => {
    const fetchData = async () => {
      const response = await apiFetch({
        route: `/short_tests/${userId}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
        setLoading,
      });

      if (response) {
        setLoading(true);
        const shortTests = await Promise.all(
          response.reverse().map(async (shortTest) => {
            shortTest.dx = await getShortTestDX(shortTest.id_short_test);
            return shortTest;
          })
        );
        setShortTests(shortTests);
        setLoading(false);
      } else {
        initialize();
        navigate("/", { replace: true });
      }
    };
    if (userToken) {
      fetchData();
    } else {
      navigate("/", { replace: true });
    }
  }, [getShortTestDX, getTestDX, initialize, navigate, userId, userToken]);

  // Deletes one short test of patient
  const deleteShortTest = useCallback(async () => {
    const response = await apiFetch({
      route: `/short_tests/${testId}`,
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });

    if (response) {
      setShortTests(
        shortTests.filter((shortTest) => shortTest.id_short_test !== testId)
      );
    } else {
      initialize();
      navigate("/", { replace: true });
    }
  }, [initialize, navigate, shortTests, testId, userToken]);

  // Adds new short test to patint
  const addShortTest = useCallback(async () => {
    const response = await apiFetch({
      route: "/short_tests",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
      body: { id_patient: `${userId}` },
    });

    if (response) {
      setTestId(response.id_short_test);
      navigate("/shorttest", { replace: true });
    } else {
      initialize();
      navigate("/", { replace: true });
    }
  }, [initialize, navigate, setTestId, userId, userToken]);

  // Changes patients general data
  const changeData = useCallback(
    async (event) => {
      event.preventDefault();

      const response = await apiFetch({
        route: `/patients/${userId}`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: newPatient,
      });

      if (response) {
        setPatient(newPatient);
        handleCloseModalEdit();
      } else {
        initialize();
        navigate("/", { replace: true });
      }
    },
    [initialize, navigate, newPatient, userId, userToken]
  );

  const dataGraph = {
    options: {
      chart: {
        id: "basic-bar",
      },
      xaxis: {
        categories: [
          "Rty",
          "Čelist",
          "Jazyk",
          "Respirace",
          "R. při f.",
          "Fonace",
          "Artikulace",
          "Prozódie",
          "Srozumitelnost",
        ],
      },
    },
    series: [
      {
        name: "series-1",
        data: [8, 6, 7, 9, 6, 5, 8, 7, 9],
      },
      {
        name: "series-2",
        data: [6, 5, 4, 7, 4, 2, 5, 4, 7],
      },
    ],
  };

  return _.isEmpty(patient) ? (
    <div className="flex--grow flex flex--justify-center flex--align-center">
      <CircularProgress />
    </div>
  ) : (
    <main className="page page__form container--default flex--grow flex flex--column flex--justify-center flex--align-center">
      <div className="page__width2">
        <List sx={{ marginBottom: 4 }}>
          <ListItem
            sx={{ display: "block" }}
            secondaryAction={
              <IconButton
                onClick={() => {
                  handleOpenModalEdit();
                }}
                edge="end"
              >
                <EditIcon />
              </IconButton>
            }
          >
            <h2>{`${patient.id_patient}, ${patient.name} ${patient.surename}`}</h2>
            <div>{`${patient.birth_year}, ${patient.gender}`}</div>
          </ListItem>
        </List>
        {/* <div className="graph">
          <Chart
            options={dataGraph.options}
            series={dataGraph.series}
            type="line"
            width="500"
          />
        </div> */}
        <h3 style={{ marginTop: 8, marginBottom: 8 }}>
          Základné testy pacienta
        </h3>
        {loading ? (
          <div className="flex--grow flex flex--justify-center flex--align-center">
            <CircularProgress />
          </div>
        ) : (
          <Paper>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{ color: "rgba(0, 0, 0, 0.6)" }}
                      width={70}
                      align="left"
                    >
                      Datum
                    </TableCell>
                    <TableCell
                      sx={{ color: "rgba(0, 0, 0, 0.6)" }}
                      width={50}
                      align="center"
                    >
                      DX
                    </TableCell>
                    <TableCell
                      sx={{ color: "rgba(0, 0, 0, 0.6)" }}
                      align="center"
                    >
                      Zobrazit
                    </TableCell>
                    <TableCell
                      sx={{ color: "rgba(0, 0, 0, 0.6)" }}
                      width={50}
                      align="right"
                    ></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tests.map((row) => (
                    <TableRow
                      key={row.id_test}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell
                        sx={{ color: "rgba(0, 0, 0, 0.6)" }}
                        align="left"
                        component="th"
                        scope="row"
                      >
                        {row.created_at}
                      </TableCell>
                      <TableCell
                        sx={{ color: "rgba(0, 0, 0, 0.6)" }}
                        align="center"
                      >
                        {row.dx}
                      </TableCell>
                      <TableCell
                        sx={{ color: "rgba(0, 0, 0, 0.6)" }}
                        align="center"
                      >
                        <Checkbox />
                      </TableCell>
                      <TableCell
                        sx={{ color: "rgba(0, 0, 0, 0.6)" }}
                        align="right"
                      >
                        <IconButton
                          onClick={() => {
                            handleOpenModal();
                            setTestId(row.id_test);
                            setIsShortTest(false);
                          }}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}

        <h3 style={{ marginTop: 24, marginBottom: 8 }}>
          Zjednodušené testy pacienta
        </h3>
        {loading ? (
          <div className="flex--grow flex flex--justify-center flex--align-center">
            <CircularProgress />
          </div>
        ) : (
          <Paper>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{ color: "rgba(0, 0, 0, 0.6)" }}
                      width={70}
                      align="left"
                    >
                      Datum
                    </TableCell>
                    <TableCell
                      sx={{ color: "rgba(0, 0, 0, 0.6)" }}
                      width={50}
                      align="center"
                    >
                      DX
                    </TableCell>
                    <TableCell
                      sx={{ color: "rgba(0, 0, 0, 0.6)" }}
                      align="center"
                    >
                      Zobrazit
                    </TableCell>
                    <TableCell
                      sx={{ color: "rgba(0, 0, 0, 0.6)" }}
                      width={50}
                      align="right"
                    ></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {shortTests.map((row) => (
                    <TableRow
                      key={row.id_short_test}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell
                        sx={{ color: "rgba(0, 0, 0, 0.6)" }}
                        align="left"
                        component="th"
                        scope="row"
                      >
                        {row.created_at}
                      </TableCell>
                      <TableCell
                        sx={{ color: "rgba(0, 0, 0, 0.6)" }}
                        align="center"
                      >
                        {row.dx}
                      </TableCell>
                      <TableCell
                        sx={{ color: "rgba(0, 0, 0, 0.6)" }}
                        align="center"
                      >
                        <Checkbox />
                      </TableCell>
                      <TableCell
                        sx={{ color: "rgba(0, 0, 0, 0.6)" }}
                        align="right"
                      >
                        <IconButton
                          onClick={() => {
                            handleOpenModal();
                            setTestId(row.id_short_test);
                            setIsShortTest(true);
                          }}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}
      </div>

      <Modal
        open={openModal}
        onClose={() => {
          handleCloseModal();
          setIsOptionsTF(true);
          setIsDeleteTF(false);
        }}
      >
        <Box className="flex flex--column flex--justify-center flex--align-center modal page__form">
          {isOptionsTF && (
            <>
              <Button
                onClick={() => {
                  isShortTest
                    ? navigate("/shorttest", { replace: true })
                    : navigate("/test", { replace: true });
                  handleCloseModal();
                  setIsVisibleMenuButton(false);
                  setIsVisibleProfileButton(false);
                }}
                sx={{ width: 210, height: 56 }}
                variant="outlined"
                color="primary"
                startIcon={<EditIcon />}
              >
                Upravit test
              </Button>
              <Button
                onClick={() => {
                  setIsDeleteTF(true);
                  setIsOptionsTF(false);
                }}
                sx={{ width: 210, height: 56 }}
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
              >
                Smazat
              </Button>
            </>
          )}
          {isDeleteTF && (
            <>
              {isShortTest ? (
                <h4>Opravdu chcete smazat krátký test?</h4>
              ) : (
                <h4>Opravdu chcete smazat test?</h4>
              )}

              <div className="flex flex--justify-space-between page__form">
                <Button
                  onClick={() => {
                    setIsDeleteTF(false);
                    setIsOptionsTF(true);
                    handleCloseModal();
                  }}
                  sx={{ width: 100 }}
                  variant="outlined"
                  size="small"
                  color="primary"
                >
                  Zrušit
                </Button>
                <Button
                  onClick={() => {
                    isShortTest ? deleteShortTest() : deleteTest();
                    setIsDeleteTF(false);
                    setIsOptionsTF(true);
                    handleCloseModal();
                  }}
                  sx={{ width: 100 }}
                  variant="outlined"
                  size="small"
                  color="error"
                  startIcon={<DeleteIcon />}
                >
                  Smazat
                </Button>
              </div>
            </>
          )}
        </Box>
      </Modal>

      <Modal open={openModalTest} onClose={handleCloseModalTest}>
        <Box className="flex flex--column flex--justify-center flex--align-center modal page__form">
          <h4>Výběr testu</h4>
          <Button
            onClick={() => {
              handleCloseModalTest();
              addTest();
              setIsShortTest(false);
              setIsVisibleMenuButton(false);
              setIsVisibleProfileButton(false);
              setCancelNewTestButton(true);
            }}
            sx={{ width: 210, height: 56 }}
            variant="contained"
          >
            Základní verze
          </Button>
          <Button
            onClick={() => {
              handleCloseModalTest();
              addShortTest();
              setIsShortTest(true);
              setIsVisibleMenuButton(false);
              setIsVisibleProfileButton(false);
              setCancelNewTestButton(true);
            }}
            sx={{ width: 210, height: 56 }}
            variant="contained"
          >
            Zjednodušená verze
          </Button>
        </Box>
      </Modal>

      <Modal open={openModalEdit} onClose={handleCloseModalEdit}>
        <Box className="flex flex--column flex--justify-center flex--align-center modal page__form">
          <form
            onSubmit={changeData}
            className="flex flex--column flex--justify-center flex--align-center page__form"
          >
            <h4>Změnit údaje pacienta</h4>
            <TextField
              onChange={(event) =>
                setNewPatient({ ...newPatient, name: event.target.value })
              }
              label="Jméno"
              variant="outlined"
              value={newPatient.name}
            />
            <TextField
              onChange={(event) =>
                setNewPatient({
                  ...newPatient,
                  surename: event.target.value,
                })
              }
              label="Příjmení"
              variant="outlined"
              value={newPatient.surename}
            />

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                views={["year"]}
                label="Rok narození"
                value={new Date(newPatient.birth_year, 0)}
                maxDate={new Date()}
                onChange={(newValue) =>
                  setNewPatient({
                    ...newPatient,
                    birth_year: new Date(newValue).getFullYear(),
                  })
                }
                renderInput={(params) => (
                  <TextField {...params} helperText={null} />
                )}
              />
            </LocalizationProvider>
            <FormControl className="page__width">
              <InputLabel>Pohlaví</InputLabel>
              <Select
                label="Pohlaví"
                value={newPatient.gender}
                onChange={(event) =>
                  setNewPatient({
                    ...newPatient,
                    gender: event.target.value,
                  })
                }
              >
                <MenuItem value={"M"}>Mužské</MenuItem>
                <MenuItem value={"F"}>Ženské</MenuItem>
              </Select>
            </FormControl>
            <div className="flex flex--justify-space-between page__form">
              <Button
                color="error"
                type="button"
                sx={{ width: 100 }}
                variant="outlined"
                size="small"
                onClick={() => {
                  setNewPatient(patient);
                  handleCloseModalEdit();
                }}
              >
                Zrušit
              </Button>
              <Button
                type="submit"
                sx={{ width: 100 }}
                variant="outlined"
                size="small"
              >
                Změnit
              </Button>
            </div>
          </form>
        </Box>
      </Modal>

      <Fab
        onClick={() => {
          handleOpenModalTest();
        }}
        sx={{ position: "fixed", bottom: 20, right: 20 }}
        color="primary"
        variant="extended"
      >
        <AddIcon sx={{ mr: 1 }} />
        Přidat test
      </Fab>
    </main>
  );
};

export default Patient;
