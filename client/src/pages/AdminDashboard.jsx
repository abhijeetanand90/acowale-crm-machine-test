import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  FormControl,
  Grid,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import { getFeedbackList, getFeedbackSummary } from "../api/feedbackApi";
import { feedbackCategories } from "../constants/feedbackOptions";

const feedbackStatuses = [
  {
    label: "Open",
    value: "open",
  },
  {
    label: "Reviewed",
    value: "reviewed",
  },
  {
    label: "Resolved",
    value: "resolved",
  },
];

const initialFilters = {
  search: "",
  category: "",
  status: "",
  page: 1,
  limit: 10,
};

const statusColor = {
  open: "warning",
  reviewed: "info",
  resolved: "success",
};

function formatDate(value) {
  return new Date(value).toLocaleString();
}
function getCategoryLabel(value) {
  const match = feedbackCategories.find(function (category) {
    return category.value === value;
  });

  return match ? match.label : value;
}

function AdminDashboard() {
  const [summary, setSummary] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  async function fetchDashboardData(currentFilters) {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const [summaryResponse, listResponse] = await Promise.all([
        getFeedbackSummary(),
        getFeedbackList(currentFilters),
      ]);

      setSummary(summaryResponse.data);
      setFeedbacks(listResponse.data);
      setPagination(listResponse.pagination);
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to load dashboard data.";

      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(function () {
    let shouldIgnore = false;

    Promise.all([getFeedbackSummary(), getFeedbackList(initialFilters)])
      .then(function ([summaryResponse, listResponse]) {
        if (shouldIgnore) return;

        setSummary(summaryResponse.data);
        setFeedbacks(listResponse.data);
        setPagination(listResponse.pagination);
      })
      .catch(function (error) {
        if (shouldIgnore) return;

        const message =
          error.response?.data?.message || "Failed to load dashboard data.";

        setErrorMessage(message);
      })
      .finally(function () {
        if (shouldIgnore) return;

        setIsLoading(false);
      });

    return function () {
      shouldIgnore = true;
    };
  }, []);

  function handleFilterChange(event) {
    const { name, value } = event.target;

    setFilters(function (currentFilters) {
      return {
        ...currentFilters,
        [name]: value,
        page: 1,
      };
    });
  }

  function handleApplyFilters() {
    fetchDashboardData(filters);
  }

  function handleResetFilters() {
    setFilters(initialFilters);
    fetchDashboardData(initialFilters);
  }

  const total = summary?.total || 0;
  const openCount = summary?.statusCounts?.open || 0;
  const reviewedCount = summary?.statusCounts?.reviewed || 0;
  const resolvedCount = summary?.statusCounts?.resolved || 0;

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "grey.100", py: 4 }}>
      <Container maxWidth="lg">
        <Stack spacing={3}>
          <Box>
            <Typography variant="h4" fontWeight={700}>
              Admin Dashboard
            </Typography>

            <Typography variant="body1" color="text.secondary">
              Track feedback volume, categories, status and recent submissions.
            </Typography>
          </Box>

          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

          {isLoading && <LinearProgress />}

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="text.secondary">Total Feedback</Typography>
                  <Typography variant="h4" fontWeight={700}>
                    {total}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="text.secondary">Open</Typography>
                  <Typography variant="h4" fontWeight={700}>
                    {openCount}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="text.secondary">Reviewed</Typography>
                  <Typography variant="h4" fontWeight={700}>
                    {reviewedCount}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="text.secondary">Resolved</Typography>
                  <Typography variant="h4" fontWeight={700}>
                    {resolvedCount}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Card>
            <CardContent>
              <Stack spacing={2}>
                <Typography variant="h6" fontWeight={700}>
                  Category Distribution
                </Typography>

                {summary?.categoryCounts?.map(function (item) {
                  const percentage = total > 0 ? (item.count / total) * 100 : 0;

                  return (
                    <Box key={item.category}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: 0.75,
                        }}
                      >
                        <Typography variant="body2" fontWeight={500}>
                          {getCategoryLabel(item.category)}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          fontWeight={600}
                        >
                          {item.count}
                        </Typography>
                      </Box>

                      <LinearProgress
                        variant="determinate"
                        value={percentage}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                        }}
                      />
                    </Box>
                  );
                })}
              </Stack>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Stack spacing={2}>
                <Typography variant="h6" fontWeight={700}>
                  Feedback Submissions
                </Typography>

                <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                  <TextField
                    name="search"
                    label="Search"
                    value={filters.search}
                    onChange={handleFilterChange}
                    fullWidth
                  />

                  <FormControl fullWidth>
                    <InputLabel id="category-filter-label">Category</InputLabel>

                    <Select
                      labelId="category-filter-label"
                      name="category"
                      value={filters.category}
                      label="Category"
                      onChange={handleFilterChange}
                    >
                      <MenuItem value="">All</MenuItem>

                      {feedbackCategories.map(function (category) {
                        return (
                          <MenuItem key={category.value} value={category.value}>
                            {category.label}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth>
                    <InputLabel id="status-filter-label">Status</InputLabel>

                    <Select
                      labelId="status-filter-label"
                      name="status"
                      value={filters.status}
                      label="Status"
                      onChange={handleFilterChange}
                    >
                      <MenuItem value="">All</MenuItem>

                      {feedbackStatuses.map(function (status) {
                        return (
                          <MenuItem key={status.value} value={status.value}>
                            {status.label}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>

                  <Button variant="contained" onClick={handleApplyFilters}>
                    Apply
                  </Button>

                  <Button variant="outlined" onClick={handleResetFilters}>
                    Reset
                  </Button>
                </Stack>

                <Box sx={{ overflowX: "auto" }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Category</TableCell>
                        <TableCell>Feedback</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Created</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {feedbacks.map(function (feedback) {
                        return (
                          <TableRow key={feedback.id}>
                            <TableCell>
                              {getCategoryLabel(feedback.category)}
                            </TableCell>

                            <TableCell>{feedback.comment}</TableCell>

                            <TableCell>{feedback.email || "-"}</TableCell>

                            <TableCell>
                              <Chip
                                label={feedback.status}
                                size="small"
                                color={
                                  statusColor[feedback.status] || "default"
                                }
                              />
                            </TableCell>

                            <TableCell>
                              {formatDate(feedback.createdAt)}
                            </TableCell>
                          </TableRow>
                        );
                      })}

                      {feedbacks.length === 0 && !isLoading && (
                        <TableRow>
                          <TableCell colSpan={5} align="center">
                            No feedback found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </Box>

                {pagination && (
                  <Typography variant="body2" color="text.secondary">
                    Showing {feedbacks.length} of {pagination.total} feedback
                    items.
                  </Typography>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </Container>
    </Box>
  );
}

export default AdminDashboard;
