import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export const setHeaders = (authKey: string, authValue: string) => {
    var myHeaders = new Headers();
    myHeaders.append(authKey, authValue);
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Access-Control-Allow-Headers", "*");
    myHeaders.append(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    return myHeaders;
};

export const processTags = (tags: string) => {
    console.log(tags.split(","));
    return tags.split(",");
  };

export const postToForem = async (title: string, markdownContent: string, imageUrl: string, tags: string, foremKey: string) => {
    console.log(imageUrl);
    const payload = {
      article: {
        title,
        published: true,
        body_markdown: markdownContent,
        tags: processTags(tags),
        main_image: imageUrl,
      },
    };

    const myHeaders = setHeaders("api-key", foremKey);
    const requestOptions: any = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(payload),
      redirect: "follow",
    };

    return await fetch("/api/forem", requestOptions);
  };


  export const postToHashnode = async (title: string, markdownContent: string, imageUrl: string, tags: string, hashnode_key: string, hashnode_publication_id: string, canonical_url?: string) => {

    const query = `
    mutation createPublicationStory($input: CreateStoryInput!, $publicationId: String!) {
      createPublicationStory(
        input: $input,
        publicationId: $publicationId
        hideFromHashnodeFeed: false
      ) {
        code
        success
        message
      }
    }    
    `
    const variables = {
      input: {
        title,
        contentMarkdown: markdownContent,
        coverImageURL: imageUrl.length > 0 ? imageUrl : "",
        tags: [
          {
            _id: "56744721958ef13879b94c7e",
            name: "General Programming",
            slug: "programming",
          },
        ],
        isAnonymous: false,
        isRepublished: {
          originalArticleURL: canonical_url,
        },
      },
      publicationId: hashnode_publication_id
    };

    const response = await fetch("https://api.hashnode.com/", {
      method: "POST",
      headers: {
        "Accept-Encoding": "gzip, deflate, br",
        "Content-Type": "application/json",
        Accept: "application/json",
        Connection: "keep-alive",
        DNT: "1",
        Origin: "https://api.hashnode.com",
        Authorization: hashnode_key,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    const data = await response.json();
    return { status: response.status, data };
  };


  export const postToMedium = async (title: string, markdownContent: string, imageUrl: string, tags: string, medium_key: string, canonical_url?: string) => {
    const payload = {
      title: title,
      contentFormat: "markdown",
      content: markdownContent,
      tags: processTags(tags),
      canonicalUrl: canonical_url,
      publishStatus: "public",
    };

    const myHeaders = setHeaders(
      "Authorization",
      `Bearer ${medium_key}`
    );
    const requestOptions: any = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(payload),
      redirect: "follow",
    };

    const response = await fetch("/api/medium/id", {
      method: "GET",
      headers: myHeaders,
    });

    const { data: user_id } = await response.json();

    console.log(user_id);
    if (response.status === 200) {
      const medium_post_response = await fetch(
        `/api/medium?id=${user_id}`,
        requestOptions
      );
      const { data } = await medium_post_response.json();
      return { status: medium_post_response.status, data };
    }
  };

  export const showAlert = (message: string): JSX.Element => {
    return (
      <div
        className="mb-3 rounded-lg bg-green-100 py-5 px-6 text-base text-green-700"
        role="alert"
      >
        {message}
      </div>
    )
  }

  const showMarkdownPreview = (markdownContent: any) => {
    return(
      <div
      className="dark:prose-invert prose prose-slate max-w-none overflow-auto rounded-lg border p-4 focus:outline-none"
      style={{ height: "70vh" }}
    >
      <ReactMarkdown
        children={markdownContent}
        remarkPlugins={[remarkGfm]}
      />
    </div>
    )
  }
  export const renderModal = (markdownContent: any) => {
    return(

      <div className="modal fade fixed top-0 left-0 hidden w-full h-full outline-none"
        id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" 
        aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog relative max-w-none pointer-events-none" style={{width: "90%"}}>
          <div
            className="modal-content border-none shadow-lg relative flex flex-col w-full pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current">
            <div
              className="modal-header flex flex-shrink-0 items-center justify-between p-4 border-b border-gray-200 rounded-t-md">
              <h5 className="text-xl font-medium leading-normal text-gray-800" id="exampleModalLabel">
                Post Preview
              </h5>
              <button type="button"
                className="btn-close box-content w-4 h-4 p-1 text-black border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline"
                data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body relative p-4">
             {
             showMarkdownPreview(markdownContent)
             }
            </div>
 
          </div>
        </div>
      </div>
    )
  }