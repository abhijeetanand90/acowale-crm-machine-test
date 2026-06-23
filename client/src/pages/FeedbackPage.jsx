import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { createFeedback } from "../api/feedbackApi";
import { feedbackCategories } from "../constants/feedbackOptions";

const initialFormState = {
  category: "",
  comment: "",
  email: "",
};

const MAX_COMMENT_LENGTH = 1000;

function FeedbackPage() {
  const [formData, setFormData] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData(function (currentFormData) {
      return {
        ...currentFormData,
        [name]: value,
      };
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");

    if (!formData.category || !formData.comment.trim()) {
      setErrorMessage("Please select a category and enter your feedback.");
      return;
    }

    try {
      setIsSubmitting(true);

      await createFeedback({
        category: formData.category,
        comment: formData.comment.trim(),
        email: formData.email.trim() || null,
      });

      setSuccessMessage("Thank you! Your feedback has been submitted.");
      setFormData(initialFormState);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";

      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  const commentLength = formData.comment.length;
  const isNearLimit = commentLength > MAX_COMMENT_LENGTH * 0.9;

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "grey.100", py: { xs: 4, sm: 6 } }}>
      <Container maxWidth="sm">
        <Card elevation={3} sx={{ borderRadius: 3, overflow: "hidden" }}>
          {/* Accent header strip for a bit of warmth/colour */}
          <Box
            sx={{
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              px: { xs: 3, sm: 4 },
              py: 3,
            }}
          >
            <Typography variant="h4" fontWeight={700} color="common.white">
              We value your feedback 
            </Typography>
            <Typography
              variant="body1"
              sx={{ mt: 0.5, color: "rgba(255,255,255,0.85)" }}
            >
              Help us improve by sharing your experience.
            </Typography>
          </Box>

          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            <Stack spacing={3}>
              {successMessage && (
                <Alert severity="success">{successMessage}</Alert>
              )}

              {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

              <Box component="form" onSubmit={handleSubmit} noValidate>
                <Stack spacing={2.5}>
                  <FormControl fullWidth required>
                    <InputLabel id="category-label">Category</InputLabel>

                    <Select
                      labelId="category-label"
                      name="category"
                      value={formData.category}
                      label="Category"
                      onChange={handleChange}
                    >
                      {feedbackCategories.map(function (category) {
                        return (
                          <MenuItem key={category.value} value={category.value}>
                            {category.label}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>

                  <TextField
                    name="comment"
                    label="Your feedback"
                    placeholder="Share your thoughts, suggestions, or issues..."
                    value={formData.comment}
                    onChange={handleChange}
                    multiline
                    minRows={5}
                    required
                    fullWidth
                    inputProps={{ maxLength: MAX_COMMENT_LENGTH }}
                    helperText={`${commentLength}/${MAX_COMMENT_LENGTH}`}
                    FormHelperTextProps={{
                      sx: {
                        textAlign: "right",
                        m: 0,
                        mt: 0.5,
                        color: isNearLimit ? "error.main" : "text.secondary",
                      },
                    }}
                  />

                  <TextField
                    name="email"
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    fullWidth
                    helperText="Optional — we'll only use this to follow up."
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={isSubmitting}
                    fullWidth
                    sx={{ py: 1.5, mt: 1, textTransform: "none", fontWeight: 600 }}
                  >
                    {isSubmitting ? "Submitting..." : "Submit feedback"}
                  </Button>
                </Stack>
              </Box>

              <Typography
                variant="caption"
                color="text.secondary"
                textAlign="center"
              >
                Your email is optional and only used for follow-up.
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default FeedbackPage;