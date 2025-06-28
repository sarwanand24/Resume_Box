export interface VercelDeploymentResponse {
  url?: string;
  deploymentId?: string;
  status?: string;
  success?: boolean;
  error?: string;
}


interface VercelFile {
  file: string;
  data: string;
}

export const deployToVercel = async (
  htmlContent: string,
  projectName: string,
  vercelToken: string
): Promise<VercelDeploymentResponse> => {
  if (!vercelToken) {
    throw new Error('Vercel token is required. Please set VITE_VERCEL_TOKEN in your environment variables.');
  }

  const sanitizedProjectName = projectName
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 63);

  const files: VercelFile[] = [
    {
      file: 'index.html',
      data: htmlContent
    },
    {
      file: 'vercel.json',
      data: JSON.stringify({
        "version": 2,
        "builds": [
          {
            "src": "index.html",
            "use": "@vercel/static"
          }
        ],
        "routes": [
          {
            "src": "/(.*)",
            "dest": "/index.html"
          }
        ]
      }, null, 2)
    }
  ];

  try {
    const response = await fetch('https://api.vercel.com/v13/deployments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${vercelToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: sanitizedProjectName,
        files: files,
        projectSettings: {
          framework: null,
          buildCommand: null,
          outputDirectory: null,
          installCommand: null,
          devCommand: null
        },
        target: 'production'
      }),
    });

    console.log('checking response------->', response)

    if (!response.ok) {
      console.log('No error form here--->')
      const errorText = await response.text();
      let errorMessage = `Deployment failed: ${response.status} ${response.statusText}`;
      
      try {
        const errorData = JSON.parse(errorText);
        if (errorData.error?.message) {
          errorMessage += `. ${errorData.error.message}`;
        }
      } catch {
        // If we can't parse the error as JSON, just use the status text
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    
    // Ensure we have the required data
    if (!data.url || !data.id) {
      throw new Error('Invalid response from Vercel API - missing URL or deployment ID');
    }
    console.log('Hurray the link---------->', `https://${data.url}`,)
    return {
      url: `https://${data.url}`,
      deploymentId: data.id,
      status: data.readyState || 'BUILDING'
    };
  } catch (error) {
    console.error('Vercel deployment error:', error);
    // Re-throw the error so it can be handled by the calling component
    throw error;
  }
};

export const checkDeploymentStatus = async (
  deploymentId: string,
  vercelToken: string
): Promise<{ status: string; url?: string }> => {
  try {
    const response = await fetch(`https://api.vercel.com/v13/deployments/${deploymentId}`, {
      headers: {
        'Authorization': `Bearer ${vercelToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to check deployment status: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      status: data.readyState || 'UNKNOWN',
      url: data.url ? `https://${data.url}` : undefined
    };
  } catch (error) {
    console.error('Error checking deployment status:', error);
    throw error;
  }
};