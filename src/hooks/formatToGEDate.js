export const formatToGeorgianDate = (isoDateString) => {    

  const date = new Date(isoDateString);

    const georgianWeekdayAbbreviations = ['კვი','ორშ','სამ','ოთხ', 'ხუთ', 'პარ', 'შაბ'];

    const dayOfWeek = date.getDay();

    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1);
    const year = date.getFullYear();
    
    return `${georgianWeekdayAbbreviations[dayOfWeek]} - ${day}/${month}/${year}`;
  }
  