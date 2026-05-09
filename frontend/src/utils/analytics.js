export const track = {
  pdfUploaded: (subject, sizeKb) => {
    if (import.meta.env.DEV) console.log('[Analytics] pdf_uploaded', { subject, sizeKb });
  },
  planGenerated: (subject, mode, topicsCount) => {
    if (import.meta.env.DEV) console.log('[Analytics] plan_generated', { subject, mode, topicsCount });
  },
  chatMessageSent: () => {
    if (import.meta.env.DEV) console.log('[Analytics] chat_message_sent');
  },
  errorOccurred: (context, message) => {
    if (import.meta.env.DEV) console.log('[Analytics] error', { context, message });
  },
  insightsViewed: (clustersCount, patternsFound) => {
    if (import.meta.env.DEV) console.log('[Analytics] insights_viewed', { clustersCount, patternsFound });
  },
  chatbotMessageSent: (length) => {},
  topicChipSelected: (topic) => {},
  studyPlanGenerated: (subject, mode, topicsCount, questionsCount) => {},
  modeSelected: (mode) => {},
  chatbotOpened: () => {},
  planDownloaded: () => {},
};

export default track;