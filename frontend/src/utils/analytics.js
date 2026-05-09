import posthog from 'posthog-js';

export const track = {
  otpSent: (phoneLength) => posthog.capture('otp_sent', { phone_length: phoneLength }),
  otpVerified: (success) => posthog.capture('otp_verified', { success }),
  pdfUploaded: (subject, fileSizeKb) => posthog.capture('pdf_uploaded', { subject, file_size_kb: fileSizeKb }),
  studyPlanGenerated: (subject, mode, topicCount, questionCount) => posthog.capture('study_plan_generated', { subject, mode, topic_count: topicCount, question_count: questionCount }),
  chatbotOpened: () => posthog.capture('chatbot_opened'),
  chatbotMessageSent: (messageLength) => posthog.capture('chatbot_message_sent', { message_length: messageLength }),
  modeSelected: (selectedMode) => posthog.capture('mode_selected', { selected_mode: selectedMode }),
  topicChipSelected: (topicName) => posthog.capture('topic_chip_selected', { topic_name: topicName }),
  planDownloaded: () => posthog.capture('plan_downloaded'),
  errorOccurred: (location, message) => posthog.capture('error_occurred', { location, message }),
};

export default track;
