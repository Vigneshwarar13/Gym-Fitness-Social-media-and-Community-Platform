import { useState, useEffect, useCallback } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Users, MessageSquare, MapPin, Search, Star, Send, Heart, MessageCircle } from 'lucide-react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

interface Post {
  _id: string;
  userId: {
    _id: string;
    name: string;
    profilePic?: string;
  };
  content: string;
  image?: string;
  likes: string[];
  comments: Array<{
    userId: {
      _id: string;
      name: string;
      profilePic?: string;
    };
    text: string;
    createdAt: string;
  }>;
  createdAt: string;
}

const communities = [
  { id: 1, name: 'CrossFit Elite', members: 1240, posts: 56, image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=100&h=100&fit=crop' },
  { id: 2, name: 'Yoga Lovers', members: 890, posts: 34, image: 'https://images.unsplash.com/photo-1588286840104-4bd37b2585dc?w=100&h=100&fit=crop' },
  { id: 3, name: 'Powerlifting Pro', members: 2100, posts: 12, image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=100&h=100&fit=crop' },
];

const gyms = [
  { id: 1, name: 'Gold\'s Gym', distance: '0.8 miles', rating: 4.8, address: '123 Main St, New York' },
  { id: 2, name: 'Planet Fitness', distance: '1.2 miles', rating: 4.2, address: '456 Broadway, New York' },
  { id: 3, name: 'Equinox', distance: '2.5 miles', rating: 4.9, address: '789 5th Ave, New York' },
];

const chats = [
  { id: 1, name: 'Sarah Connor', message: 'Hey! Are we still on for tomorrow?', time: '10:30 AM', unread: 2, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop' },
  { id: 2, name: 'Mike Ross', message: 'Great workout today!', time: 'Yesterday', unread: 0, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop' },
];

export default function Community() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'communities' | 'chats' | 'gyms' | 'feed'>('feed');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostImage, setNewPostImage] = useState<File | null>(null);
  const [commentText, setCommentText] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (activeTab === 'feed') {
      fetchPosts();
    }
  }, [activeTab, page, fetchPosts]);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await API.get(`/posts?page=${page}&limit=10`);
      setPosts(res.data.posts);
      setPages(res.data.pages);
    } catch (err: unknown) {
      setError((err as any).response?.data?.message || 'Failed to fetch posts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page]);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      let imageUrl = '';
      if (newPostImage) {
        const formData = new FormData();
        formData.append('image', newPostImage);
        const uploadRes = await API.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        imageUrl = uploadRes.data.url;
      }
      await API.post('/posts', { content: newPostContent, image: imageUrl });
      setNewPostContent('');
      setNewPostImage(null);
      fetchPosts();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create post');
      console.error(err);
    }
  };

  const handleLikePost = async (postId: string) => {
    try {
      await API.post(`/posts/like/${postId}`);
      fetchPosts(); // Refresh posts to show updated likes
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to like/unlike post');
      console.error(err);
    }
  };

  const handleAddComment = async (postId: string) => {
    if (!commentText[postId]) return;
    try {
      await API.post(`/posts/comment/${postId}`, { text: commentText[postId] });
      setCommentText({ ...commentText, [postId]: '' });
      fetchPosts(); // Refresh posts to show new comment
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add comment');
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex space-x-2 border-b border-gray-800 pb-1">
        <button
          onClick={() => setActiveTab('feed')}
          className={`flex items-center px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'feed' ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <Users className="mr-2 h-4 w-4" />
          Feed
        </button>
        <button
          onClick={() => setActiveTab('communities')}
          className={`flex items-center px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'communities' ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <Users className="mr-2 h-4 w-4" />
          Communities
        </button>
        <button
          onClick={() => setActiveTab('chats')}
          className={`flex items-center px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'chats' ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <MessageSquare className="mr-2 h-4 w-4" />
          Chats
        </button>
        <button
          onClick={() => setActiveTab('gyms')}
          className={`flex items-center px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'gyms' ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <MapPin className="mr-2 h-4 w-4" />
          Nearby Gyms
        </button>
      </div>

      {/* Content */}
      <div className="min-h-[400px]">
        {activeTab === 'feed' && (
          <div className="space-y-6">
            <Card className="p-4">
              <h3 className="font-bold text-lg mb-4">Create New Post</h3>
              <form onSubmit={handleCreatePost} className="space-y-4">
                <textarea
                  className="w-full p-2 rounded-md bg-dark-700 border border-dark-600 text-white focus:ring-primary focus:border-primary"
                  placeholder="What's on your mind?"
                  rows={3}
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  required
                ></textarea>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNewPostImage(e.target.files ? e.target.files[0] : null)}
                  className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-dark-900 hover:file:bg-primary/80"
                />
                <Button type="submit" className="w-full">Post</Button>
              </form>
            </Card>

            {error && <p className="text-red-500 text-center">{error}</p>}
            {loading ? (
              <div className="text-white text-center">Loading posts...</div>
            ) : posts.length === 0 ? (
              <div className="text-gray-400 text-center">No posts yet. Be the first to post!</div>
            ) : (
              posts.map((post) => (
                <Card key={post._id} className="p-4 space-y-4">
                  <div className="flex items-center space-x-3">
                    <img src={post.userId.profilePic || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=256&h=256&fit=crop"} alt={post.userId.name} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <p className="font-bold">{post.userId.name}</p>
                      <p className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                  <p className="text-gray-200">{post.content}</p>
                  {post.image && <img src={post.image} alt="Post image" className="w-full rounded-md object-cover max-h-96" />}
                  
                  <div className="flex items-center space-x-4 text-gray-400">
                    <Button variant="ghost" size="sm" onClick={() => handleLikePost(post._id)}>
                      <Heart className={`h-5 w-5 mr-1 ${user && post.likes.includes(user._id) ? 'text-red-500 fill-current' : ''}`} /> {post.likes.length} Likes
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MessageCircle className="h-5 w-5 mr-1" /> {post.comments.length} Comments
                    </Button>
                  </div>

                  {post.comments.length > 0 && (
                    <div className="space-y-2 border-t border-gray-700 pt-4 mt-4">
                      {post.comments.map((comment, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <img src={comment.userId.profilePic || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=256&h=256&fit=crop"} alt={comment.userId.name} className="w-8 h-8 rounded-full object-cover" />
                          <div>
                            <p className="text-sm font-bold">{comment.userId.name}</p>
                            <p className="text-sm text-gray-300">{comment.text}</p>
                            <p className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <form onSubmit={(e) => { e.preventDefault(); handleAddComment(post._id); }} className="flex space-x-2 mt-4">
                    <Input
                      type="text"
                      placeholder="Add a comment..."
                      value={commentText[post._id] || ''}
                      onChange={(e) => setCommentText({ ...commentText, [post._id]: e.target.value })}
                      className="flex-1"
                    />
                    <Button type="submit" size="sm">Comment</Button>
                  </form>
                </Card>
              ))
            )}

            {/* Pagination */}
            {pages > 1 && (
              <div className="flex justify-center space-x-2 mt-6">
                <Button variant="outline" onClick={() => setPage(prev => Math.max(1, prev - 1))} disabled={page === 1}>Previous</Button>
                {[...Array(pages)].map((_, i) => (
                  <Button key={i} variant={page === i + 1 ? 'primary' : 'outline'} onClick={() => setPage(i + 1)}>{i + 1}</Button>
                ))}
                <Button variant="outline" onClick={() => setPage(prev => Math.min(pages, prev + 1))} disabled={page === pages}>Next</Button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'communities' && (
          <div className="space-y-6">
            <div className="flex gap-4">
               <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input placeholder="Find communities..." className="pl-10" />
               </div>
               <Button>Create Group</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {communities.map((community) => (
                  <Card key={community.id} className="p-4 flex flex-col items-center text-center space-y-4">
                     <img src={community.image} alt={community.name} className="w-20 h-20 rounded-full object-cover" />
                     <div>
                        <h3 className="font-bold text-lg">{community.name}</h3>
                        <p className="text-sm text-gray-400">{community.members} Members • {community.posts} Posts/day</p>
                     </div>
                     <Button variant="outline" className="w-full">Join Community</Button>
                  </Card>
               ))}
            </div>
          </div>
        )}

        {activeTab === 'chats' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[600px]">
             {/* Chat List */}
             <Card className="col-span-1 p-4 flex flex-col">
                <h3 className="font-bold mb-4">Messages</h3>
                <div className="space-y-2 overflow-y-auto flex-1">
                   {chats.map((chat) => (
                      <div key={chat.id} className="flex items-center p-3 rounded-lg hover:bg-gray-800 cursor-pointer">
                         <div className="relative">
                            <img src={chat.avatar} alt={chat.name} className="w-12 h-12 rounded-full object-cover" />
                            {chat.unread > 0 && <div className="absolute top-0 right-0 w-3 h-3 bg-primary rounded-full border-2 border-gray-900" />}
                         </div>
                         <div className="ml-3 flex-1 overflow-hidden">
                            <div className="flex justify-between items-baseline">
                               <p className="font-bold truncate">{chat.name}</p>
                               <p className="text-xs text-gray-500">{chat.time}</p>
                            </div>
                            <p className="text-sm text-gray-400 truncate">{chat.message}</p>
                         </div>
                      </div>
                   ))}
                </div>
             </Card>

             {/* Chat Window */}
             <Card className="col-span-2 p-4 flex flex-col">
                <h3 className="font-bold mb-4">Chat with Sarah Connor</h3>
                <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-dark-900 rounded-md">
                   {/* Example messages */}
                   <div className="flex justify-start">
                      <div className="bg-gray-700 p-3 rounded-lg max-w-[70%] text-white">
                         Hi Mike, are you free for a workout session tomorrow morning?
                      </div>
                   </div>
                   <div className="flex justify-end">
                      <div className="bg-primary p-3 rounded-lg max-w-[70%] text-dark-900">
                         Hey Sarah! Yeah, I'm free around 8 AM.
                      </div>
                   </div>
                </div>
                <div className="flex gap-2 mt-4">
                   <Input placeholder="Type your message..." className="flex-1" />
                   <Button><Send className="h-5 w-5" /></Button>
                </div>
             </Card>
          </div>
        )}

        {activeTab === 'gyms' && (
          <div className="space-y-6">
            <div className="flex gap-4">
               <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input placeholder="Find nearby gyms..." className="pl-10" />
               </div>
               <Button>Filter</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {gyms.map((gym) => (
                  <Card key={gym.id} className="p-4 space-y-2">
                     <h3 className="font-bold text-lg">{gym.name}</h3>
                     <p className="text-sm text-gray-400 flex items-center gap-1"><MapPin className="h-4 w-4" /> {gym.address}</p>
                     <p className="text-sm text-gray-400 flex items-center gap-1"><Star className="h-4 w-4 text-yellow-400 fill-current" /> {gym.rating} ({gym.distance})</p>
                     <Button variant="outline" className="w-full">View Details</Button>
                  </Card>
               ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
