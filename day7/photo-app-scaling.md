\# Day 7 Assignment: SnapShare Photo App Scaling Plan



\## 1. Introduction



SnapShare is a photo-sharing application that allows users to upload photos, follow other users, and scroll through a feed of photos shared by the people they follow. As the number of users and photos increases, the system must handle high traffic, store large amounts of image data, and deliver photos quickly and reliably.



This scaling plan proposes an architecture that separates application processing, photo storage, database operations, caching, and background processing. The design aims to improve performance, availability, and scalability while controlling infrastructure costs.



\## 2. Assumptions and Workload Estimates



The following assumptions are used to estimate SnapShare's workload:



\- The application has 10,000,000 registered users.

\- 10% of registered users are active each day.

\- Each daily active user uploads one photo per day.

\- Each daily active user views 50 feed pages per day.

\- Each original photo has an average size of 2 MB.

\- Each original photo produces one thumbnail of 50 KB.

\- One day contains 86,400 seconds, and one year contains 365 days.

\- Storage calculations use decimal units: 1 MB = 1,000 KB, 1 GB = 1,000 MB, and 1 TB = 1,000 GB.

\- The average workload is distributed across the entire day; peak feed traffic is estimated at five times the average rate.

\- The estimates exclude retries, deleted photos, database records, backups, storage replication, and additional growth beyond the stated user activity.



\### 2.1 Daily Active Users



Daily active users (DAU) are the registered users who use the application on a particular day.



\*\*Formula:\*\*



Daily Active Users = Registered Users × Daily Activity Rate



\*\*Calculation:\*\*



10,000,000 × 10% = 1,000,000 daily active users.



Therefore, SnapShare is expected to have \*\*1,000,000 daily active users\*\*.



\### 2.2 Photo Uploads Per Second



Each daily active user uploads one photo per day.



Daily uploads = 1,000,000 × 1 = 1,000,000 photos per day.



Average uploads per second = Daily uploads ÷ Seconds per day



= 1,000,000 ÷ 86,400



= 11.57 uploads per second.



Therefore, SnapShare must support an average of approximately \*\*12 photo uploads per second\*\*.



\### 2.3 Feed Views Per Second



Each daily active user views 50 feed pages per day.



Daily feed views = 1,000,000 × 50



= 50,000,000 feed views per day.



Average feed views per second:



50,000,000 ÷ 86,400 = 578.70 feed views per second.



Therefore, the average feed workload is approximately \*\*579 feed views per second\*\*.



The estimated peak rate is five times the average rate.



Peak feed views per second = 578.70 × 5



= 2,893.52 feed views per second.



Therefore, SnapShare should plan for approximately \*\*2,894 feed views per second at peak traffic\*\*.



These are planning estimates rather than guaranteed capacity limits; actual traffic patterns and load testing should determine the final capacity.



\### 2.4 Photo Storage Per Year



Each original photo requires 2 MB of storage, while each thumbnail requires 50 KB.



\*\*Original photo storage per day:\*\*



1,000,000 photos × 2 MB = 2,000,000 MB



= 2,000 GB = 2 TB per day.



\*\*Original photo storage per year:\*\*



2 TB × 365 = 730 TB per year.



\*\*Thumbnail storage per day:\*\*



1,000,000 thumbnails × 50 KB = 50,000,000 KB



= 50,000 GB? No; converting units correctly:



50,000,000 KB ÷ 1,000,000 = 50 GB per day.



\*\*Thumbnail storage per year:\*\*



50 GB × 365 = 18,250 GB = 18.25 TB per year.



\*\*Total annual image storage:\*\*



730 TB + 18.25 TB = 748.25 TB per year.



Therefore, SnapShare needs approximately \*\*730 TB per year for original photos\*\* and \*\*18.25 TB per year for thumbnails\*\*, giving a combined annual image-storage requirement of approximately \*\*748.25 TB\*\*.



This estimate assumes that all uploaded photos and generated thumbnails are retained for the entire year. It excludes backups, replicas, metadata, and storage overhead.



\### 2.5 Summary of Workload Estimates



| Metric | Estimated value |

|---|---:|

| Registered users | 10,000,000 |

| Daily active users | 1,000,000 |

| Daily photo uploads | 1,000,000 |

| Average uploads per second | 11.57 |

| Daily feed views | 50,000,000 |

| Average feed views per second | 578.70 |

| Peak feed views per second | 2,893.52 |

| Original photo storage per year | 730 TB |

| Thumbnail storage per year | 18.25 TB |

| Total image storage per year | 748.25 TB |



\## 3. Is SnapShare Read-Heavy or Write-Heavy?



SnapShare is a \*\*read-heavy system\*\* because users view feed pages much more frequently than they upload photos.



Each active user uploads one photo per day but views 50 feed pages per day. Therefore, the estimated number of feed views is 50 times the number of uploads.



Although feed views and photo uploads are different operations, this ratio indicates that the application must prioritize efficient reading and delivery of content.



The architecture should therefore:



\- Use a Content Delivery Network (CDN) to deliver cached images and thumbnails close to users.

\- Use Redis or another caching system to store frequently requested feed data.

\- Use a database read replica to handle read queries without placing all read traffic on the primary database.

\- Store photo files in object storage rather than inside database records.

\- Use background workers to generate thumbnails without delaying the upload response.

\- Scale application servers horizontally to handle changes in traffic.



These measures reduce the load on the primary database and application servers while improving feed-loading performance.



\## 4. Why Photos Should Not Be Stored Inside the Database



Original photos and thumbnails should be stored in \*\*object storage\*\*, such as Amazon S3 or an equivalent service, rather than directly inside relational database tables.



Photos are large binary objects. Storing them inside the database would increase database size, backup duration, replication traffic, and the amount of data transferred during database operations. It could also make database scaling more expensive.



Object storage is designed to store large files efficiently and can scale independently of the application database. It also supports durable storage and integration with a CDN.



The database should instead store photo metadata, such as:



\- Photo ID.

\- User ID of the uploader.

\- Object-storage key or URL.

\- Caption and upload timestamp.

\- Thumbnail object key.

\- Visibility and other relevant information.



This separation allows the database to manage searchable information while object storage manages the actual image files.



\## 5. SnapShare Architecture Diagram



The following text diagram illustrates the proposed architecture and the relationships between the major components.



```text

&#x20;                        +----------------------+

&#x20;                        |    Mobile / Web      |

&#x20;                        |       Clients        |

&#x20;                        +----------+-----------+

&#x20;                                   |

&#x20;                    +--------------+--------------+

&#x20;                    |                             |

&#x20;                    v                             v

&#x20;          +-------------------+        +----------------------+

&#x20;          |       CDN         |        |   Load Balancer      |

&#x20;          | Cached Images,    |        | Distributes Requests |

&#x20;          | Thumbnails, CSS   |        +----------+-----------+

&#x20;          +---------+---------+                   |

&#x20;                    |                             v

&#x20;                    |                  +----------------------+

&#x20;                    |                  |    App Servers       |

&#x20;                    |                  |  (Stateless APIs)    |

&#x20;                    |                  +--+--------+--------+-+

&#x20;                    |                     |        |        |

&#x20;                    |                     v        v        v

&#x20;                    |               +---------+ +------+ +----------+

&#x20;                    |               |  Redis  | |Primary| |  Queue   |

&#x20;                    |               |  Cache  | |  DB   | | Thumbnail|

&#x20;                    |               +---------+ +--+---+ |   Jobs   |

&#x20;                    |                               |     +-----+----+

&#x20;                    |                               |           |

&#x20;                    |                               v           v

&#x20;                    |                         +----------+ +----------+

&#x20;                    |                         | Read     | | Thumbnail|

&#x20;                    |                         | Replica  | |  Worker  |

&#x20;                    |                         +----------+ +-----+----+

&#x20;                    |                                               |

&#x20;                    v                                               v

&#x20;          +----------------------+                       +----------------------+

&#x20;          |    Object Storage    |<----------------------|    Object Storage    |

&#x20;          | Original Photos      |                       | Thumbnail Files     |

&#x20;          +----------------------+                       +----------------------+

```



\*\*Diagram note:\*\* Both original photos and thumbnails can be stored in the same object-storage service using separate keys or prefixes. They are shown separately to make their roles clear. The CDN retrieves cached or uncached image files from object storage, while the application servers manage metadata and application logic. The thumbnail worker writes generated thumbnails to object storage and records their locations in the database.



\## 6. Explanation of Each Architecture Component



1\. \*\*Mobile and Web Clients:\*\* These provide the interface through which users upload photos, follow other users, and view their feeds.



2\. \*\*Content Delivery Network (CDN):\*\* The CDN caches and serves photos, thumbnails, and other static files from geographically distributed locations to reduce latency and origin-server traffic.



3\. \*\*Load Balancer:\*\* The load balancer distributes incoming API requests across available application servers to prevent one server from becoming overloaded.



4\. \*\*Stateless Application Servers:\*\* These process authentication, uploads, feed requests, and business logic while allowing requests to be handled by any healthy server.



5\. \*\*Redis Cache:\*\* Redis stores frequently accessed feed data and metadata so that repeated reads can be served quickly without querying the database every time.



6\. \*\*Primary Database:\*\* The primary database stores authoritative application records, including users, follows, photo metadata, captions, and other information that must be managed consistently.



7\. \*\*Database Read Replica:\*\* The read replica handles suitable read queries, such as feed metadata retrieval, to reduce read pressure on the primary database.



8\. \*\*Object Storage:\*\* Object storage holds original photos and generated thumbnails separately from the database, providing scalable storage for large image files.



9\. \*\*Message Queue:\*\* The queue holds thumbnail-generation jobs until workers can process them, allowing photo uploads to complete without waiting for thumbnail generation.



10\. \*\*Thumbnail Worker:\*\* The worker retrieves queued jobs, reads original photos, generates smaller thumbnail images, stores the results in object storage, and updates the relevant metadata.



\## 7. Step-by-Step Photo Upload Flow



The following steps describe how SnapShare processes a photo upload.



1\. \*\*User selects a photo:\*\* The user chooses an image through the mobile or web application and submits the upload request.



2\. \*\*Request reaches the application:\*\* The request passes through the load balancer to an available application server, which authenticates the user and validates the request.



3\. \*\*Upload destination is prepared:\*\* The application generates a unique photo ID and an object-storage key. Where supported, it provides the client with a short-lived, authorized upload URL so the photo can be uploaded directly to object storage.



4\. \*\*Original photo is uploaded:\*\* The client uploads the original image to object storage using the authorized URL. The application verifies that the upload completed successfully before marking the photo as ready.



5\. \*\*Metadata is saved:\*\* The application records the photo ID, uploader ID, storage key, caption, timestamp, and processing status in the primary database.



6\. \*\*Thumbnail job is queued:\*\* After the original image is available, the application places a thumbnail-generation job on the message queue.



7\. \*\*Upload response is returned:\*\* The application confirms that the original photo has been uploaded and accepted for processing. The thumbnail may still be pending, so the user does not need to wait for the worker to finish.



8\. \*\*Worker processes the job:\*\* A background worker retrieves the queued job and reads the original image from object storage.



9\. \*\*Thumbnail is generated:\*\* The worker resizes and compresses the image to create a thumbnail with an average target size of 50 KB, while maintaining suitable visual quality.



10\. \*\*Thumbnail is stored:\*\* The worker saves the thumbnail in object storage using its own key and updates the database with the thumbnail location and processing status.



11\. \*\*Feed and cache are updated:\*\* The application makes the photo metadata available to the appropriate feeds and invalidates or updates affected cache entries so users can see fresh information.



12\. \*\*Photo is delivered to viewers:\*\* When followers request their feeds, the application retrieves feed metadata from the cache or database, and the CDN serves the original or thumbnail image as needed.



This asynchronous workflow improves upload responsiveness because thumbnail generation occurs in the background. The queue also helps absorb temporary increases in upload traffic.



\## 8. Scaling Trade-Offs



\### 8.1 Caching Versus Data Freshness



Caching feed data in Redis reduces database queries and improves response times. However, cached information can become stale when a user uploads a photo, changes a caption, or unfollows another user.



The system must invalidate or update affected cache entries, which introduces additional complexity. A suitable cache-expiration policy can balance freshness and performance.



\### 8.2 Database Read Replicas Versus Consistency



A read replica reduces the read workload on the primary database and allows read capacity to scale independently. However, replication may lag behind the primary database, meaning recently uploaded photos might not immediately appear in every feed.



The system can use the primary database for operations requiring the latest confirmed data and tolerate brief replication delays for less time-sensitive feed reads.



\### 8.3 Asynchronous Processing Versus Immediate Availability



A message queue and background worker prevent thumbnail generation from slowing down photo uploads. However, thumbnails may not be immediately available, and a failed worker can leave jobs waiting in the queue.



The system should implement retries, monitoring, and dead-letter handling for repeatedly failing jobs. The user interface can show a processing state until the thumbnail is ready.



\### 8.4 Object Storage and CDN Versus Cost and Complexity



Object storage and a CDN provide scalable file delivery and reduce the workload on application servers. However, they introduce storage, request, and data-transfer costs, as well as additional configuration and access-control requirements.



The system should use appropriate image sizes, cache-control settings, lifecycle policies, and private or public access rules to balance performance, security, and cost.



\### 8.5 Horizontal Scaling Versus Operational Complexity



Adding application servers helps the system handle more concurrent requests and improves resilience when an individual server fails. However, operating more servers increases monitoring, deployment, and troubleshooting requirements.



Automated health checks, centralized logging, metrics, and automated deployment can reduce this operational burden.



\## 9. Conclusion



SnapShare's estimated workload is one million daily active users, one million photo uploads per day, and 50 million feed views per day. This corresponds to approximately 12 uploads per second and 579 average feed views per second, with a projected peak of about 2,894 feed views per second.



The system requires approximately 730 TB of original-photo storage and 18.25 TB of thumbnail storage per year, excluding backups and replication.



Because SnapShare is read-heavy, the proposed architecture emphasizes CDN delivery, Redis caching, database read replicas, stateless application servers, and scalable object storage. A message queue and background thumbnail worker separate image processing from the user-facing upload request.



Together, these components provide a practical foundation for scaling SnapShare while balancing performance, data freshness, reliability, cost, and operational complexity.



