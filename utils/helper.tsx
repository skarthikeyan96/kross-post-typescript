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


  export const postToHashnode = async (title: string, markdownContent: string, imageUrl: string, tags: string, hashnode_key: string, canonical_url?: string, ) => {
    const query =
      'mutation createPublicationStory($input: CreateStoryInput!) {\n  createPublicationStory(\n    input: $input\n    publicationId: "5faeafa108f9e538a0136e73"\n    hideFromHashnodeFeed: false\n  ) {\n    code\n    success\n    message\n  }\n}\n';
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