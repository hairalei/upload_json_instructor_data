const data = require('./sample.json');
const fs = require('fs');
console.log(data.length);

function removeHtmlTags(htmlString) {
  const plainText = htmlString.replace(/<[^>]*>?/gm, '');
  return plainText;
}

const channelsObj = {};
const links = [];
const uniqueBios = [];

const get_channels = async () => {
  const res = await fetch(
    'https://x8ki-letl-twmt.n7.xano.io/api:Ux6lKo8E/channels'
  );
  const jsonData = await res.json();

  // This will create a channelsObj with this format with names as keys and ids as values {youtube: 1, website: 2}
  jsonData.forEach((channel) => {
    channelsObj[channel.name.toLowerCase()] = channel.id;
    links.push(channel.name.toLowerCase());
  });
};

get_channels()
  .then((_) => {
    // For every data of instructors, it will update the "social_links" to "channels" with the correct format like in Xano

    data.forEach((item) => {
      if (uniqueBios.includes(item.Bio)) {
        item['unique'] = false;
        return;
      }

      uniqueBios.push(item.Bio);

      const channels = [];

      for (const [key, value] of Object.entries(item)) {
        if (links.includes(key.toLowerCase()) && value.length > 3) {
          channels.push({
            channel_id: channelsObj[key.toLowerCase()],
            link: value,
          });
        }

        if (key === 'Bio') {
          const bio = removeHtmlTags(value);
          item['Bio'] = bio;
        }
      }

      item['Channels'] = channels;
      item['students'] = Number(item['Total students'].replace(',', ''));
    });
  })
  .catch((err) => console.log(err))
  .finally(() => {
    const newData = data.filter((item) => !item.hasOwnProperty('unique'));

    const jsonData = JSON.stringify(newData, null, 2); // Convert data to JSON string with indentation

    fs.writeFile('data.json', jsonData, 'utf8', (err) => {
      if (err) {
        console.error('Error writing JSON file:', err);
      } else {
        console.log('JSON file created successfully');
        console.log(newData.length);
      }
    });
  });
