import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { getAllStudents } from '../../../redux/studentRelated/studentHandle';
import { Paper, Box, Select, MenuItem, FormControl, InputLabel, Typography, List, ListItem, ListItemText, Button } from '@mui/material';
import { GreenButton, BlueButton } from '../../../components/buttonStyles';

const Billing = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { studentsList, loading, error, response } = useSelector((state) => state.student);
    const { currentUser } = useSelector(state => state.user);

    const [selectedClass, setSelectedClass] = useState('');
    const [filteredStudents, setFilteredStudents] = useState([]);

    // Fetching students data
    useEffect(() => {
        dispatch(getAllStudents(currentUser._id));
    }, [currentUser._id, dispatch]);

    // Filtering students based on selected class
    useEffect(() => {
        if (selectedClass) {
            setFilteredStudents(studentsList.filter(student => student.sclassName.sclassName === selectedClass));
        } else {
            setFilteredStudents(studentsList);
        }
    }, [selectedClass, studentsList]);

    const handleClassChange = (event) => {
        setSelectedClass(event.target.value);
    };

    return (
        <>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <>
                    {response ? (
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                            <GreenButton variant="contained" onClick={() => navigate("/Admin/addstudents")}>
                                Add Students
                            </GreenButton>
                        </Box>
                    ) : (
                        <>
                            {/* Select Class */}
                            <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                                <FormControl sx={{ minWidth: 200 }}>
                                    <InputLabel>Class</InputLabel>
                                    <Select
                                        value={selectedClass}
                                        onChange={handleClassChange}
                                        label="Class"
                                    >
                                        <MenuItem value="">
                                            <em>All Classes</em>
                                        </MenuItem>
                                        {studentsList.map((student, index) => (
                                            <MenuItem key={index} value={student.sclassName.sclassName}>
                                                {student.sclassName.sclassName}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>

                            {/* Display Students */}
                            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                                {filteredStudents.length > 0 ? (
                                    <>
                                        <Typography variant="h6" align="center" sx={{ margin: '16px' }}>
                                            Students in {selectedClass ? selectedClass : "All Classes"}:
                                        </Typography>
                                        <List>
                                            {filteredStudents.map((student) => (
                                                <ListItem key={student._id}>
                                                    <ListItemText
                                                        primary={student.name}
                                                        secondary={`Roll Number: ${student.rollNum}`}
                                                    />
                                                    <BlueButton variant="contained"
                                                        onClick={() => navigate("/Admin/students/student/" + student._id)}>
                                                        View
                                                    </BlueButton>
                                                    <BlueButton variant="contained"
                                                        onClick={() => navigate("/Admin/students/student/billing/" + student._id)}>
                                                        Pay Bill
                                                    </BlueButton>
                                                </ListItem>
                                            ))}
                                        </List>
                                    </>
                                ) : (
                                    <Typography variant="h6" align="center" sx={{ padding: '20px' }}>
                                        No students found for this class.
                                    </Typography>
                                )}
                            </Paper>
                        </>
                    )}
                </>
            )}
        </>
    );
};

export default Billing;
