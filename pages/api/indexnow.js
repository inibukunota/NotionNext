export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { urls } = req.body

  const response = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      host: 'motomento.com',
      key: '5f3dd28613b6443ebc0cc939e99ca6f0',
      keyLocation: 'https://motomento.com/5f3dd28613b6443ebc0cc939e99ca6f0.txt',
      urlList: urls
    })
  })

  const data = await response.text()

  res.status(200).json({ success: true, data })
}
