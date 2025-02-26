## Key Codes
```
  // myDate: formData.myDate ? new Date(formData.myDate).toISOString().split('T')[0] : null,

  // myDate: Date | null = null;

  // inside the subscribe method where you get data from the server
  // this.myDate = data.myDate ? new Date(data.myDate) : null;
``` 

 formData.append('createTaskRequest', new Blob([JSON.stringify(createTaskRequest)], { type: 'application/json' }));
  
  converting json to formdata 