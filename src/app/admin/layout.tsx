import React from 'react'
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import ArticleIcon from '@mui/icons-material/Article';
import CommentIcon from '@mui/icons-material/Comment';
import Header from '@/component/header';
type Props = {
    children: React.ReactNode
}

const layout = ({ children }: Props) => {
    const menu = [
        {
            name: "ダッシュボード",
            link: "/admin",
            icon: <DashboardIcon />
        },
        {
            name: "ユーザー",
            link: "/admin/users",
            icon: <PersonIcon />

        },
        {
            name: "投稿",
            link: "/admin/posts",
            icon: <ArticleIcon />

        },
        {
            name: "コメント",
            link: "/admin/comments",
            icon: <CommentIcon />

        }
    ]
    return (
        <div className='admin'>
            <Header />
            <div className="admin_main center">
                <div className="admin_main_left">
                    {menu?.map((item, index) => <div className='menu_item ' key={index}>{item.icon}<p>{item.name}</p></div>)}
                </div>
                {children}

            </div>
            <div className="admin_footer">
                Copyrights ASTEM CO.,LTD.
            </div>
        </div>
    )
}

export default layout