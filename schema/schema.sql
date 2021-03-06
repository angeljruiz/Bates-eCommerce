PGDMP     (                    w         	   SharkReef    11.4    11.4      8           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                       false            9           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                       false            :           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                       false            ;           1262    24576 	   SharkReef    DATABASE     �   CREATE DATABASE "SharkReef" WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'English_United States.1252' LC_CTYPE = 'English_United States.1252';
    DROP DATABASE "SharkReef";
             postgres    false            �            1259    24608    cart    TABLE     g   CREATE TABLE public.cart (
    items character varying NOT NULL,
    cid character varying NOT NULL
);
    DROP TABLE public.cart;
       public         postgres    false            �            1259    32875    image    TABLE     �   CREATE TABLE public.image (
    sku bigint NOT NULL,
    name character varying NOT NULL,
    type character varying(4) NOT NULL,
    num bigint NOT NULL
);
    DROP TABLE public.image;
       public         postgres    false            �            1259    32895    image_order_seq    SEQUENCE     x   CREATE SEQUENCE public.image_order_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.image_order_seq;
       public       postgres    false    204            <           0    0    image_order_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public.image_order_seq OWNED BY public.image.num;
            public       postgres    false    205            �            1259    32832    lock    TABLE     �   CREATE TABLE public.lock (
    sid character varying(45) NOT NULL,
    sku bigint NOT NULL,
    amount bigint NOT NULL,
    lid bigint NOT NULL
);
    DROP TABLE public.lock;
       public         postgres    false            �            1259    32837    lock_lid_seq    SEQUENCE     u   CREATE SEQUENCE public.lock_lid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.lock_lid_seq;
       public       postgres    false    202            =           0    0    lock_lid_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.lock_lid_seq OWNED BY public.lock.lid;
            public       postgres    false    203            �            1259    24582 
   marinefish    TABLE     �   CREATE TABLE public.marinefish (
    sku bigint NOT NULL,
    rs boolean NOT NULL,
    ming smallint NOT NULL,
    ag character(3)
);
    DROP TABLE public.marinefish;
       public         postgres    false            �            1259    24603    orders    TABLE     �  CREATE TABLE public.orders (
    fn character varying(30) NOT NULL,
    ln character varying(30) NOT NULL,
    date character varying(20) NOT NULL,
    processing boolean NOT NULL,
    finalized boolean NOT NULL,
    cid character varying(50) NOT NULL,
    line1 character varying(55),
    city character varying(35),
    postal_code bigint,
    shipped character varying(25),
    state character varying(2)
);
    DROP TABLE public.orders;
       public         postgres    false            �            1259    24577    product    TABLE     �   CREATE TABLE public.product (
    sku bigint NOT NULL,
    name character varying(25) NOT NULL,
    price double precision,
    description character varying(50),
    quantity bigint NOT NULL,
    store bigint,
    type character varying
);
    DROP TABLE public.product;
       public         postgres    false            �            1259    24623    session    TABLE     �   CREATE TABLE public.session (
    sid character varying NOT NULL,
    sess json NOT NULL,
    expire timestamp(6) without time zone NOT NULL
);
    DROP TABLE public.session;
       public         postgres    false            �            1259    32934    store    TABLE     �   CREATE TABLE public.store (
    id bigint NOT NULL,
    name character varying NOT NULL,
    url character varying NOT NULL,
    paid bigint,
    email character varying NOT NULL
);
    DROP TABLE public.store;
       public         postgres    false            �            1259    32932    store_id_seq    SEQUENCE     u   CREATE SEQUENCE public.store_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.store_id_seq;
       public       postgres    false    207            >           0    0    store_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.store_id_seq OWNED BY public.store.id;
            public       postgres    false    206            �            1259    24595    users    TABLE     �   CREATE TABLE public.users (
    username character varying(15) NOT NULL,
    email character varying(35) NOT NULL,
    password character varying NOT NULL,
    pp bit varying,
    id character varying
);
    DROP TABLE public.users;
       public         postgres    false            �
           2604    32897 	   image num    DEFAULT     h   ALTER TABLE ONLY public.image ALTER COLUMN num SET DEFAULT nextval('public.image_order_seq'::regclass);
 8   ALTER TABLE public.image ALTER COLUMN num DROP DEFAULT;
       public       postgres    false    205    204            �
           2604    32839    lock lid    DEFAULT     d   ALTER TABLE ONLY public.lock ALTER COLUMN lid SET DEFAULT nextval('public.lock_lid_seq'::regclass);
 7   ALTER TABLE public.lock ALTER COLUMN lid DROP DEFAULT;
       public       postgres    false    203    202            �
           2604    32937    store id    DEFAULT     d   ALTER TABLE ONLY public.store ALTER COLUMN id SET DEFAULT nextval('public.store_id_seq'::regclass);
 7   ALTER TABLE public.store ALTER COLUMN id DROP DEFAULT;
       public       postgres    false    206    207    207            �
           2606    24617 	   cart c_pk 
   CONSTRAINT     H   ALTER TABLE ONLY public.cart
    ADD CONSTRAINT c_pk PRIMARY KEY (cid);
 3   ALTER TABLE ONLY public.cart DROP CONSTRAINT c_pk;
       public         postgres    false    200            �
           2606    32885    image image_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.image
    ADD CONSTRAINT image_pkey PRIMARY KEY (name);
 :   ALTER TABLE ONLY public.image DROP CONSTRAINT image_pkey;
       public         postgres    false    204            �
           2606    32845    lock lock_pkey 
   CONSTRAINT     M   ALTER TABLE ONLY public.lock
    ADD CONSTRAINT lock_pkey PRIMARY KEY (lid);
 8   ALTER TABLE ONLY public.lock DROP CONSTRAINT lock_pkey;
       public         postgres    false    202            �
           2606    24589    marinefish marinefish_pkey 
   CONSTRAINT     Y   ALTER TABLE ONLY public.marinefish
    ADD CONSTRAINT marinefish_pkey PRIMARY KEY (sku);
 D   ALTER TABLE ONLY public.marinefish DROP CONSTRAINT marinefish_pkey;
       public         postgres    false    197            �
           2606    32800    orders orders_pkey 
   CONSTRAINT     Q   ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (cid);
 <   ALTER TABLE ONLY public.orders DROP CONSTRAINT orders_pkey;
       public         postgres    false    199            �
           2606    24581    product product_pkey 
   CONSTRAINT     S   ALTER TABLE ONLY public.product
    ADD CONSTRAINT product_pkey PRIMARY KEY (sku);
 >   ALTER TABLE ONLY public.product DROP CONSTRAINT product_pkey;
       public         postgres    false    196            �
           2606    24630    session session_pkey 
   CONSTRAINT     S   ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_pkey PRIMARY KEY (sid);
 >   ALTER TABLE ONLY public.session DROP CONSTRAINT session_pkey;
       public         postgres    false    201            �
           2606    32942    store store_pkey 
   CONSTRAINT     S   ALTER TABLE ONLY public.store
    ADD CONSTRAINT store_pkey PRIMARY KEY (id, url);
 :   ALTER TABLE ONLY public.store DROP CONSTRAINT store_pkey;
       public         postgres    false    207    207            �
           2606    32801 	   cart c_fk    FK CONSTRAINT     f   ALTER TABLE ONLY public.cart
    ADD CONSTRAINT c_fk FOREIGN KEY (cid) REFERENCES public.orders(cid);
 3   ALTER TABLE ONLY public.cart DROP CONSTRAINT c_fk;
       public       postgres    false    2736    199    200            �
           2606    24590    marinefish mf_fk    FK CONSTRAINT     n   ALTER TABLE ONLY public.marinefish
    ADD CONSTRAINT mf_fk FOREIGN KEY (sku) REFERENCES public.product(sku);
 :   ALTER TABLE ONLY public.marinefish DROP CONSTRAINT mf_fk;
       public       postgres    false    196    2732    197           