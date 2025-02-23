module.exports = {
    getSuggestedReply: async function (emailContent) {
      // Dummy implementation: returns a canned reply based on keywords
      if (emailContent.toLowerCase().includes('interview')) {
        return "Thank you for shortlisting my profile! I'm available for a technical interview. You can book a slot here: https://cal.com/example";
      }
      return "Thank you for reaching out. Could you please provide more details?";
    }
  };
  