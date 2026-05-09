/**
 * Prepzo Analytics — centralised PostHog event helpers.
 *
 * Always go through these functions instead of calling posthog.capture()
 * inline. Keeping event names and property shapes in one place prevents
 * typos from silently creating duplicate events in PostHog.
 *
 * All functions are safe to call before PostHog initialises (the SDK
 * queues events internally until the init promise resolves).
 */
import posthog from 'posthog-js';

export const track = {
  /**
   * Fire when an OTP is sent to a phone number.
   * Wire this up in the phone-auth flow once it is built.
   */
  otpSent: (phoneLength) => {
    posthog.capture('otp_sent', { phone_length: phoneLength });
  },

  /**
   * Fire after the server confirms whether an OTP was valid.
   * Wire this up in the phone-auth flow once it is built.
   */
  otpVerified: (success) => {
    posthog.capture('otp_verified', { success });
  },

  /** Fire immediately after a PDF is successfully processed by the server. */
  pdfUploaded: (subject, fileSizeKb) => {
    posthog.capture('pdf_uploaded', {
      subject,
      file_size_kb: fileSizeKb,
    });
  },

  /** Fire after the backend returns a generated study plan. */
  studyPlanGenerated: (subject, mode, topicCount, questionCount) => {
    posthog.capture('study_plan_generated', {
      subject,
      mode,
      topic_count: topicCount,
      question_count: questionCount,
    });
  },

  /** Fire when the user opens the chatbot from any surface. */
  chatbotOpened: () => {
    posthog.capture('chatbot_opened');
  },

  /** Fire each time the user sends a message in the chatbot. */
  chatbotMessageSent: (messageLength) => {
    posthog.capture('chatbot_message_sent', { message_length: messageLength });
  },

  /**
   * Fire when the study mode (survival / balanced / full) is first shown
   * to the user. The mode is auto-determined by the backend; this event
   * records which mode the user received.
   */
  modeSelected: (selectedMode) => {
    posthog.capture('mode_selected', { selected_mode: selectedMode });
  },

  /** Fire when the user adds a topic chip (manual add or from a cluster). */
  topicChipSelected: (topicName) => {
    posthog.capture('topic_chip_selected', { topic_name: topicName });
  },

  /** Fire when the user downloads their study plan as a file. */
  planDownloaded: () => {
    posthog.capture('plan_downloaded');
  },

  /** Fire whenever a user-visible error occurs. `location` is a short slug
   *  identifying where in the app the error happened (e.g. 'pdf_upload'). */
  errorOccurred: (location, message) => {
    posthog.capture('error_occurred', { location, message });
  },
};
