export let config = {
    svmType: 'C_SVC',
    c: [0.03125, 0.125, 0.5, 2, 8], 
    
    // kernels parameters 
    kernelType: 'RBF',  
    gamma: [0.03125, 0.125, 0.5, 2, 8],
    
    // training options 
    kFold: 4,               
    normalize: true,        
    reduce: true,           
    retainedVariance: 0.99, 
    eps: 1e-3,              
    cacheSize: 200,               
    shrinking : true,     
    probability : false     
}