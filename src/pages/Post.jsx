import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import appwriteService from "../appwrite/config"
import { Button, Container } from '../components'
import parse from 'html-react-parser'
import { useSelector } from "react-redux"
import { FaCommentAlt, FaShare } from 'react-icons/fa'
import { BiCalendar, BiUser } from 'react-icons/bi'
import ShareCard from '../components/ShareCard'
import Comments from '../components/Comments'
import { HashLink } from 'react-router-hash-link';

export default function Post() {
    const [post, setPost] = useState(null)
    const { slug } = useParams()
    const navigate = useNavigate()

    const location = useLocation()

    const userData = useSelector((state) => state.auth.userData)

    const isAuthor = post && userData ? post.userId === userData.$id : false;

    useEffect(() => {
        if (slug) {
            appwriteService.getPost(slug).then((post) => {
                console.log("post", post)
                console.log("userData: ", userData)
                if (post) setPost(post);
                else navigate('/');
            }).catch((error) => error)
        } else navigate("/");
    }, [slug, navigate])

    const deletePost = () => {
        appwriteService.deletePost(post.$id).then((status) => {
            if (status) {
                appwriteService.deleteFile(post.featuredImage);
                navigate("/");
            }
        })
    }

    const [showShareC, setShowShareC] = useState(false)

    return post ? (
        <div className="py-8 bg-cover bg-center relative  bg-gray-50">


            <Container>
                {isAuthor && (
                    <div className="absolute right-6 top-6 ">
                        <Link to={`/edit-post/${post.$id}`}>
                            <Button varient='blue' className="mr-2 px-6">
                                Edit
                            </Button>
                        </Link>
                        <Button varient='red' onClick={deletePost}>
                            Delete
                        </Button>
                    </div>
                )}

                <div className="container mx-auto max-w-4xl px-6 py-12">
                    
                    {/* Post Header */}
                    <header className="mb-6">
                        <div className="flex md:items-center max-md:flex-col gap-2 md:justify-between mb-4 md:mb-6">
                            <Link to={`/all-posts/category/${post.category}`}>
                                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                                    {post.category}
                                </span></Link>
                            <div className="flex items-center space-x-4 text-gray-600">
                                <span className="flex items-center">
                                    <BiUser className="w-4 h-4 mr-2" /> {post.author}
                                </span>
                                <span className="flex items-center">
                                    <BiCalendar className="w-4 h-4 mr-2" /> {post.updatedOn}
                                </span>

                            </div>
                        </div>

                        <h1 className="text-4xl font-bold mb-2 ">{post.title}</h1>
                        <div className='py-1   flex  items-center max-sm:flex-col'>
                            <div className='flex gap-2'>
                                <HashLink to='#comments' smooth >
                                    <button className="cursor-pointer my-1 bg-blue-100 text-blue-800 relative inline-flex items-center justify-center gap-2 text-sm font-medium  hover:bg-[#F5F5F5] hover:text-[#60A5FA] h-9 rounded-md px-3">
                                        <FaCommentAlt />
                                        Comment
                                    </button>
                                </HashLink>
                                <button onClick={() => setShowShareC(true)} className="cursor-pointer my-1 bg-blue-700 text-blue-100 relative inline-flex  items-center justify-center gap-2 text-sm font-medium  hover:bg-[#F5F5F5] hover:text-[#60A5FA] h-9 rounded-md px-3">
                                    <FaShare />
                                    Share
                                </button>
                            </div>
                        </div>
                        <ShareCard shareUrl={`${window.location.origin}${location.pathname}${location.search}`} shareIconSize={'45'} showShareCard={showShareC} onClickCross={() => setShowShareC(false)} />
                    </header>

                    {/* Featured Image */}
                    <figure className="mb-12">
                        <img
                            src={appwriteService.getFilePreview(post.featuredImage)}
                            alt={post.title}
                            className="w-full rounded-lg shadow-md"
                        />
                    </figure>

                    {/* Post Content */}
                    <article className="prose lg:prose-xl mb-12">

                        {parse(post.content)}
                    </article>

                    <div id='comments'></div>
                    <Comments postId={post.$id} />
                </div>


            </Container>
        </div>
    ) : null;
}
