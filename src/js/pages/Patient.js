import React, { useEffect, useState, useCallback, useRef } from "react";
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
import { Modal } from "@mui/material";
import { Button } from "@mui/material";
import { Box } from "@mui/system";
import { Popper } from "@mui/material";
import { Grow } from "@mui/material";
import { ClickAwayListener } from "@mui/material";
import { MenuList } from "@mui/material";
import { MenuItem } from "@mui/material";
import { Divider } from "@mui/material";
import { Fab } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { apiFetch } from "../utils/apiFetch";
import { useAppContext } from "../../App";
import { useNavigate } from "react-router-dom";
import _ from "lodash";

const Patient = () => {
  const { getItem, setItem, setTestId } = useAppContext();
  const userToken = getItem("userToken");
  const userId = getItem("userId");

  const [patient, setPatient] = useState({});
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [idTest, setIdTest] = useState("");
  const [isShortTestTF, setIsShortTestTF] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const [openModalTest, setOpenModalTest] = useState(false);
  const handleOpenModalTest = () => setOpenModalTest(true);
  const handleCloseModalTest = () => setOpenModalTest(false);

  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

  const navigate = useNavigate();

  function handleToggle() {
    setOpen((prevOpen) => !prevOpen);
  }

  const handleClose = () => {
    if (anchorRef.current && anchorRef.current.matches(":focus-within")) {
      return;
    }
    setOpen(false);
  };

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  const navTest = useCallback(() => {
    navigate("/test", { replace: true });
  }, [navigate]);

  const getDx = useCallback(
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
        setItem("userToken", "");
        setItem("userId", "");
        navigate("/", { replace: true });
      }
    },
    [navigate, setItem, userToken]
  );

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
      } else {
        setItem("userToken", "");
        setItem("userId", "");
        navigate("/", { replace: true });
      }
    };
    fetchData();
  }, [navigate, setItem, userId, userToken]);

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
            test.dx = await getDx(test.id_test);
            return test;
          })
        );
        setTests(tests);
        setLoading(false);
      } else {
        setItem("userToken", "");
        setItem("userId", "");
        navigate("/", { replace: true });
      }
    };
    fetchData();
  }, [getDx, navigate, setItem, userId, userToken]);

  const deleteTest = useCallback(async () => {
    const response = await apiFetch({
      route: `/tests/${idTest}`,
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });

    if (response) {
      setTests(tests.filter((test) => test.id_test !== idTest));
    } else {
      setItem("userToken", "");
      setItem("userId", "");
      navigate("/", { replace: true });
    }
  }, [idTest, navigate, setItem, tests, userToken]);

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
      setItem("userToken", "");
      setItem("userId", "");
      navigate("/", { replace: true });
    }
  }, [navigate, setItem, setTestId, userId, userToken]);

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
                // onClick={() => {
                //   handleOpen();
                //   setIsChangeName(true);
                // }}
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
        <h3 style={{ marginBottom: 6 }}>Základné testy pacienta</h3>
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
                          ref={anchorRef}
                          onClick={() => {
                            handleToggle();
                            setIdTest(row.id_test);
                            setIsShortTestTF(false);
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

      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        placement="bottom-start"
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom-start" ? "left top" : "left bottom",
            }}
          >
            <Paper sx={{ backgroundColor: "rgba(235, 235, 235, 1)" }}>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList autoFocusItem={open}>
                  <MenuItem
                    onClick={() => {
                      handleClose();
                      console.log("upravit");
                    }}
                  >
                    Upravit
                  </MenuItem>
                  <Divider />
                  <MenuItem
                    onClick={() => {
                      handleClose();
                      handleOpenModal();
                    }}
                  >
                    Smazat
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box className="flex flex--column flex--justify-center flex--align-center modal page__form">
          {isShortTestTF ? (
            <h4>Krátky test bude smazán</h4>
          ) : (
            <h4>Test bude smazán</h4>
          )}

          <Button
            onClick={() => {
              isShortTestTF ? console.log("deleteShortTest") : deleteTest();
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
        </Box>
      </Modal>

      <Modal open={openModalTest} onClose={handleCloseModalTest}>
        <Box className="flex flex--column flex--justify-center flex--align-center modal page__form">
          <h4>Výběr testu</h4>
          <Button
            onClick={() => {
              console.log("test");
              handleCloseModalTest();
              addTest();
            }}
            sx={{ width: 210, height: 56 }}
            variant="contained"
          >
            Základní verze
          </Button>
          <Button
            onClick={() => {
              console.log("short_test");
              handleCloseModalTest();
            }}
            sx={{ width: 210, height: 56 }}
            variant="contained"
          >
            Zjednodušená verze
          </Button>
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

      <Fab
        onClick={() => {
          navTest();
        }}
        sx={{ position: "fixed", bottom: 20, left: 20 }}
        color="primary"
        variant="extended"
      >
        <AddIcon sx={{ mr: 1 }} />
        Test
      </Fab>
    </main>
  );
};

export default Patient;
