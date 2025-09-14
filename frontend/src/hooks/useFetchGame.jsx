
const fetchGameData = async (endpoint, method, game) => {
    debugger
    const url = 'http://192.168.15.12:5000/' + endpoint;
    const res = await fetch(endpoint, {
        method: method,
        headers: {
            "Content-Type": "application/json"
        },
        body: method == 'POST' && body ? JSON.stringify({game}) : null
    })

    const data = await res.json()

    return {status: res.status, data: data};
}

//  const res = await fetch('http://192.168.15.12:5000/getGame', {
//       method: 'POST',
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify({game})
//     }).catch(error => {
//       alert('Error fetching game', error);
//       setLoading(false);
//       setbtnClicked(false);
//       return;
//     })

//     const dt = await res.json()

//     if(res.status == 200) {
//       setgamesList((prev) => [...prev, dt])
//     } 