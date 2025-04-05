const cat = [{
  "id": 1,
  "name": "Electronics",
  "slug": "electronics",
  "imageUrl": null,
  "description": null,
  "parentId": null,
  "isFeatured": true,
  "isVisible": true,
  "status": "ACTIVE",
  "createdAt": "2025-03-27T16:17:38.414Z",
  "updatedAt": "2025-03-27T16:17:38.414Z",
  "children": [
      {
          "id": 2,
          "name": "Headphones",
          "slug": "headphones",
          "imageUrl": null,
          "description": null,
          "parentId": 1,
          "isFeatured": true,
          "isVisible": true,
          "status": "ACTIVE",
          "createdAt": "2025-03-27T16:17:38.414Z",
          "updatedAt": "2025-03-27T16:17:38.414Z",
          "children": [
            {
                "id": 2,
                "name": "Headphones",
                "slug": "headphones",
                "imageUrl": null,
                "description": null,
                "parentId": 1,
                "isFeatured": true,
                "isVisible": true,
                "status": "ACTIVE",
                "createdAt": "2025-03-27T16:17:38.414Z",
                "updatedAt": "2025-03-27T16:17:38.414Z",
                "children": []
            },
            {
                "id": 3,
                "name": "Smartphones",
                "slug": "smartphones",
                "imageUrl": null,
                "description": null,
                "parentId": 1,
                "isFeatured": false,
                "isVisible": true,
                "status": "ACTIVE",
                "createdAt": "2025-03-27T16:17:38.414Z",
                "updatedAt": "2025-03-27T16:17:38.414Z",
                "children": [    {
                  "id": 2,
                  "name": "Headphones",
                  "slug": "headphones",
                  "imageUrl": null,
                  "description": null,
                  "parentId": 1,
                  "isFeatured": true,
                  "isVisible": true,
                  "status": "ACTIVE",
                  "createdAt": "2025-03-27T16:17:38.414Z",
                  "updatedAt": "2025-03-27T16:17:38.414Z",
                  "children": []
              },]
            },
            {
                "id": 4,
                "name": "Laptops",
                "slug": "laptops",
                "imageUrl": null,
                "description": null,
                "parentId": 1,
                "isFeatured": true,
                "isVisible": true,
                "status": "ACTIVE",
                "createdAt": "2025-03-27T16:17:38.414Z",
                "updatedAt": "2025-03-27T16:17:38.414Z",
                "children": []
            }
        ],
      },
      {
          "id": 3,
          "name": "Smartphones",
          "slug": "smartphones",
          "imageUrl": null,
          "description": null,
          "parentId": 1,
          "isFeatured": false,
          "isVisible": true,
          "status": "ACTIVE",
          "createdAt": "2025-03-27T16:17:38.414Z",
          "updatedAt": "2025-03-27T16:17:38.414Z",
          "children": []
      },
      {
          "id": 4,
          "name": "Laptops",
          "slug": "laptops",
          "imageUrl": null,
          "description": null,
          "parentId": 1,
          "isFeatured": true,
          "isVisible": true,
          "status": "ACTIVE",
          "createdAt": "2025-03-27T16:17:38.414Z",
          "updatedAt": "2025-03-27T16:17:38.414Z",
          "children": []
      }
  ],
  
}

]




console.log(getWithHierarchyStr(cat)[0])