const data = require('./test.json');
const fs = require('fs');

const channelsObj = {};

const get_channels = async () => {
  const res = await fetch(
    'https://x8ki-letl-twmt.n7.xano.io/api:Ux6lKo8E/channels'
  );
  const jsonData = await res.json();

  // This will create a channelsObj with this format {youtube: www.youtube.com, website: www.website.com}
  jsonData.forEach((channel) => {
    channelsObj[channel.name.toLowerCase()] = channel.id;
  });
};

get_channels()
  .then((_) => {
    // For every data of instructors, it will update the "social_links" to "channels" with the correct format like in Xano

    data.forEach((item) => {
      const social_link = item.social_links;
      const channels = [];

      for (const key in social_link) {
        channels.push({ id: channelsObj[key], link: social_link[key] });
      }

      item['social_links'] = channels;

      console.log(item);
    });
  })
  .catch((err) => console.log(err))
  .finally(() => {
    const jsonData = JSON.stringify(data, null, 2); // Convert data to JSON string with indentation

    fs.writeFile('data.json', jsonData, 'utf8', (err) => {
      if (err) {
        console.error('Error writing JSON file:', err);
      } else {
        console.log('JSON file created successfully');
      }
    });
  });
