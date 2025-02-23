module.exports = {
    categorize: async function (emailData) {
      const subject = emailData.subject ? emailData.subject.toLowerCase() : '';
      const text = emailData.text ? emailData.text.toLowerCase() : '';
  
      if (subject.includes('spam') || text.includes('unsubscribe')) {
        return 'Spam';
      }
      if (subject.includes('out of office')) {
        return 'Out of Office';
      }
      if (subject.includes('meeting booked') || text.includes('meeting confirmed')) {
        return 'Meeting Booked';
      }
      if (subject.includes('interview') || text.includes('interview')) {
        return 'Interested';
      }
      return 'Not Interested';
    }
  };
  